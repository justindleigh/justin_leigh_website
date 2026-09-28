// Supabase Edge Function: quo-webhook
// Receives webhook events from Quo and stores call data with full enrichment
//
// Webhook URL: https://gpckxhsiawummkkegeix.supabase.co/functions/v1/quo-webhook
//
// Required secrets:
//   QUO_API_KEY — for fetching transcripts and summaries
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY — auto-provided

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const QUO_API = "https://api.openphone.com/v1";

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const event = await req.json();
    const eventType = event.type;
    const data = event.data?.object;
    if (!eventType || !data) return json(400, { error: "Invalid payload" });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const quoKey = Deno.env.get("QUO_API_KEY");

    let result: Record<string, unknown> = { event: eventType };

    if (eventType.startsWith("call.") || eventType === "callSummary" || eventType === "callTranscript") {
      result = await handleCall(supabase, eventType, data, quoKey);
    } else if (eventType.startsWith("message.")) {
      result = await handleMessage(supabase, eventType, data);
    }

    return json(200, { success: true, ...result });
  } catch (err) {
    console.error("Webhook error:", err);
    return json(500, { error: err.message });
  }
});

async function handleCall(supabase: any, eventType: string, data: any, quoKey: string | undefined) {
  const callId = data.id || data.callId;
  const direction = data.direction || "incoming";

  // Parse Quo's actual payload format
  const fromNumber = data.from || null;
  const toNumber = data.to || null;
  const recordingUrl = data.media?.[0]?.url || null;
  const mediaDuration = data.media?.[0]?.duration || null;

  const record: Record<string, unknown> = {
    quo_call_id: callId,
    direction,
    status: data.status || "completed",
    from_number: fromNumber,
    to_number: toNumber,
    participants: [fromNumber, toNumber].filter(Boolean),
    started_at: data.createdAt,
    completed_at: data.completedAt || null,
    answered_at: data.answeredAt || null,
    answered_by: data.answeredBy || null,
    phone_number_id: data.phoneNumberId || null,
    duration: data.duration || mediaDuration || null,
    recording_url: recordingUrl,
    quo_contact_ids: data.contactIds || [],
    raw_payload: data,
  };

  // Handle summary events
  if (eventType === "callSummary" || eventType === "call.summary.completed") {
    const { error } = await supabase.from("call_records")
      .update({ summary: data.summary || [], next_steps: data.nextSteps || [] })
      .eq("quo_call_id", callId);
    return { event: eventType, callId, updated: !error };
  }

  // Handle transcript events
  if (eventType === "callTranscript" || eventType === "call.transcript.completed") {
    const dialogue = data.dialogue || [];
    const transcriptText = dialogue.map((d: any) => {
      const speaker = d.userId ? "Justin" : (d.identifier || "Caller");
      const time = fmtTime(d.start);
      return `[${time}] ${speaker}: ${d.content}`;
    }).join("\n");

    const { error } = await supabase.from("call_records")
      .update({ transcript: dialogue, transcript_text: transcriptText, duration: data.duration || null })
      .eq("quo_call_id", callId);
    return { event: eventType, callId, lines: dialogue.length, updated: !error };
  }

  // Match to existing lead/client by phone number
  const lookupNumber = direction === "incoming" ? fromNumber : toNumber;
  if (lookupNumber) {
    const { data: lead } = await supabase.from("contact_submissions")
      .select("id, name").or(`phone.eq.${lookupNumber},phone.eq.${lookupNumber.replace("+1", "")}`)
      .order("created_at", { ascending: false }).limit(1).single();
    if (lead) { record.contact_submission_id = lead.id; record.caller_name = lead.name; }

    const { data: client } = await supabase.from("clients")
      .select("id, full_name").or(`phone.eq.${lookupNumber},phone.eq.${lookupNumber.replace("+1", "")}`)
      .order("created_at", { ascending: false }).limit(1).single();
    if (client) { record.client_id = client.id; record.caller_name = client.full_name; }
  }

  // Upsert call record
  const { error } = await supabase.from("call_records").upsert(record, { onConflict: "quo_call_id" });

  // On completed call: fetch transcript + summary via API if available
  if ((eventType === "call.completed" || eventType === "call.recording.completed") && quoKey) {
    fetchAndStoreEnrichment(supabase, callId, quoKey).catch(e => console.error("Enrichment error:", e));
  }

  // Create lead for unknown inbound callers
  if (eventType === "call.completed" && direction === "incoming" && !record.contact_submission_id && fromNumber) {
    const callerDisplay = fromNumber.replace("+1", "");
    await supabase.from("contact_submissions").insert({
      name: `Quo Caller: ${callerDisplay}`,
      email: `quo-${callId}@call.justindleigh.com`,
      phone: fromNumber,
      subject: "Inbound Phone Call",
      message: `Inbound call via Quo.\nFrom: ${fromNumber}\nTo: ${toNumber}\nDuration: ${record.duration || 0}s\nCall ID: ${callId}`,
      how_heard: "Phone Call",
      status: "new",
      lead_source: "quo",
      lead_type: "call",
    });
  }

  return { event: eventType, callId, direction, from: fromNumber, to: toNumber, recording: !!recordingUrl, matched: !!(record.contact_submission_id || record.client_id) };
}

async function fetchAndStoreEnrichment(supabase: any, callId: string, quoKey: string) {
  const headers = { Authorization: quoKey };

  // Wait a bit for Quo to process transcript/summary
  await new Promise(r => setTimeout(r, 5000));

  // Fetch transcript
  try {
    const tRes = await fetch(`${QUO_API}/call-transcripts/${callId}`, { headers });
    if (tRes.ok) {
      const tData = await tRes.json();
      const obj = tData.data;
      if (obj?.dialogue) {
        const transcriptText = obj.dialogue.map((d: any) => {
          const speaker = d.userId ? "Justin" : (d.identifier || "Caller");
          return `[${fmtTime(d.start)}] ${speaker}: ${d.content}`;
        }).join("\n");
        await supabase.from("call_records")
          .update({ transcript: obj.dialogue, transcript_text: transcriptText, duration: obj.duration || null })
          .eq("quo_call_id", callId);
      }
    }
  } catch (e) { console.error("Transcript fetch error:", e); }

  // Fetch summary
  try {
    const sRes = await fetch(`${QUO_API}/call-summaries/${callId}`, { headers });
    if (sRes.ok) {
      const sData = await sRes.json();
      const obj = sData.data;
      if (obj) {
        await supabase.from("call_records")
          .update({ summary: obj.summary || [], next_steps: obj.nextSteps || [] })
          .eq("quo_call_id", callId);
      }
    }
  } catch (e) { console.error("Summary fetch error:", e); }

  // Fetch recording URL if not already set
  try {
    const rRes = await fetch(`${QUO_API}/call-recordings/${callId}`, { headers });
    if (rRes.ok) {
      const rData = await rRes.json();
      const url = rData.data?.media?.[0]?.url || rData.data?.url;
      if (url) {
        await supabase.from("call_records").update({ recording_url: url }).eq("quo_call_id", callId).is("recording_url", null);
      }
    }
  } catch (e) { console.error("Recording fetch error:", e); }
}

async function handleMessage(supabase: any, eventType: string, msg: any) {
  // OpenPhone uses different field names across versions; check all common ones.
  const direction = (msg.direction || "").toLowerCase();
  const isInbound = direction === "incoming" || direction === "inbound" || direction === "received";

  if (eventType === "message.received" && isInbound) {
    const fromNumber = msg.from;
    const messageText = msg.text || msg.body || msg.content || "";

    // Look up existing lead by phone (deduplicate so same caller doesn't create N leads).
    const { data: existing } = await supabase.from("contact_submissions")
      .select("id, message")
      .eq("phone", fromNumber)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!existing) {
      await supabase.from("contact_submissions").insert({
        name: `Quo Message: ${fromNumber?.replace("+1", "")}`,
        email: `quo-msg-${msg.id}@message.justindleigh.com`,
        phone: fromNumber,
        subject: "Inbound Text Message",
        message: messageText,
        how_heard: "Text Message",
        status: "new",
        lead_source: "quo",
        lead_type: "message",
      });
    } else if (messageText && (!existing.message || existing.message.length < messageText.length)) {
      // If existing row has empty/shorter message, append the new one.
      const updated = existing.message
        ? `${existing.message}\n\n---\n${messageText}`
        : messageText;
      await supabase.from("contact_submissions").update({ message: updated }).eq("id", existing.id);
    }
  }
  return { event: eventType, messageId: msg.id, captured: msg.text || msg.body || msg.content ? true : false };
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
