import "@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// A mail header cannot exceed 998 octets (RFC 5322), and the subject built
// below is whatever the visitor typed plus their name. On 2026-10-30 somebody
// pasted an entire letter into the Subject box, the header came to roughly
// 3,575 characters, the send was rejected, and nobody was told: the row saved,
// the visitor got a Thank You page, and the lead reached no inbox. Clip what
// goes in the header. Nothing is lost, because the untruncated field is
// rendered in the body table below.
const SUBJECT_FIELD_MAX = 120;
const SUBJECT_LINE_MAX = 200;

function clip(value: unknown, max: number): string {
  const s = String(value ?? "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const form = await req.json();
    const isAI = form.type === "ai_inquiry";

    // A visitor who names a day and time is asking to be called. That signal
    // was collected by the form, inserted into contact_submissions, and then
    // left out of the field list below -- so the assistant agent, which reads
    // the row, could see it, and the inbox, which reads this email, could not.
    // Justin, 2026-10-31: "I didn't see that come in through the email from
    // the form from the website ... I need to figure out to fix that so that I
    // can see whether they're requesting a call or not, regardless of what the
    // assistant agent tells me."
    //
    // It goes in two places on purpose. The body row is the record. The
    // subject marker is what he actually reads, because a lead is triaged from
    // a phone notification before anybody opens the message.
    const wantsCall = clip(form.preferred_datetime, 80);
    const callFlag = wantsCall ? "[CALL REQUESTED] " : "";

    // "Do you have documents to share?" is a free-text box, so the answer
    // arrives as whatever the person typed. Treat anything that is not a
    // clear no as a yes, and mark the subject.
    //
    // The asymmetry is deliberate. A false positive costs one unnecessary
    // offer of an upload link. A false negative is a client who has the
    // document that decides their case and never gets asked for it. "None"
    // and "not sure" both start with n and read as no, which is right.
    const docsAnswer = clip(form.has_documents, 60);
    const saysNo = /^n/i.test(docsAnswer);
    const docsFlag = docsAnswer && !saysNo ? "[DOCS] " : "";

    let rows: string;
    let emailSubject: string;
    let heading: string;
    let footerNote: string;

    if (isAI) {
      // A.I. Consultation Inquiry
      const fields = [
        ["Name", form.name],
        ["Email", form.email],
        ["Phone", form.phone],
        ["Practice Details", form.message],
      ].filter(([, v]) => v);

      rows = fields
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 12px;font-weight:bold;color:#c9a84c;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 12px;color:#ffffff">${String(value).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("");

      emailSubject = `A.I. Consultation Submission - ${clip(form.name, 80)}`;
      heading = "New A.I. Consultation Inquiry";
      footerNote = "Submitted via Stalefish A.I. Consultation form";
    } else {
      // Legal Contact Form
      const fields = [
        ["Name", form.name],
        ["Email", form.email],
        ["Phone", form.phone],
        ["Preferred Day/Time", form.preferred_datetime],
        ["Subject", form.subject],
        ["Message", form.message],
        ["Opposing Party", form.opposing_party],
        ["Opposing Counsel", form.opposing_counsel],
        ["Court Case", form.court_case],
        ["Cause Number", form.case_number],
        ["Their Own Attorney", form.other_attorney],
        ["Has Documents", form.has_documents],
        ["How They Heard", form.how_heard],
        ["Real Estate Inquiry", form.real_estate_inquiry],
      ].filter(([, v]) => v);

      rows = fields
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 12px;font-weight:bold;color:#c9a84c;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 12px;color:#ffffff">${String(value).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("");

      emailSubject = `${callFlag}${docsFlag}New Legal Inquiry: ${clip(form.subject, SUBJECT_FIELD_MAX)} - ${clip(form.name, 80)}`;
      heading = "New Contact Form Submission";
      footerNote = "Submitted via justindleigh.com contact form";
    }

    const html = `
      <div style="background:#0a1628;padding:32px;font-family:Arial,sans-serif">
        <h2 style="color:#c9a84c;margin:0 0 24px">${heading}</h2>
        ${isAI ? '<div style="display:inline-block;background:#c9a84c;color:#0a1628;padding:4px 12px;font-size:12px;font-weight:bold;letter-spacing:1px;margin-bottom:16px">STALEFISH A.I.</div>' : ''}
        <table style="width:100%;border-collapse:collapse;background:#000;border:1px solid #1a2a44">
          ${rows}
        </table>
        <p style="color:#666;font-size:12px;margin-top:24px">
          ${footerNote} at ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const from = isAI
      ? "Stalefish A.I. <contactrequest@justindleigh.com>"
      : "Law Office Contact <contactrequest@justindleigh.com>";

    async function send(subject: string) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: ["justindleigh@gmail.com"],
          subject: subject.slice(0, SUBJECT_LINE_MAX),
          html,
        }),
      });
      return { ok: r.ok, data: await r.json() };
    }

    let res = await send(emailSubject);

    // A lead that reaches no inbox is the failure that matters, so if the
    // composed subject is refused for any reason, say it plainly and try once
    // more with a subject that cannot be refused. The body is unchanged.
    if (!res.ok) {
      // The marker survives the fallback. This path fires exactly when
      // something has already gone wrong with the composed subject, which is
      // the worst moment to drop the one word that decides how fast he calls.
      const bare = isAI
        ? "A.I. Consultation Submission"
        : `${callFlag}${docsFlag}New Legal Inquiry`;
      console.error("first send rejected, retrying with a bare subject", res.data);
      res = await send(bare);
    }

    if (!res.ok) {
      console.error("contact notification FAILED, no email was delivered", res.data);
      return new Response(JSON.stringify({ error: res.data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: res.data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
