// Sends billing notification to jdllaw.admin@gmail.com when a lead is promoted to client
// Also available as a manual trigger from the CRM

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors() });

  try {
    const { client_name, email, phone, case_type, billing_type, quoted_amount, hourly_rate, trust_deposit, contingency_pct, case_description } = await req.json();

    if (!client_name) return json(400, { error: "client_name required" });
    if (!RESEND_API_KEY) return json(500, { error: "RESEND_API_KEY not configured" });

    // Build billing breakdown
    let billingBreakdown = "";
    const bt = billing_type || "not_specified";
    const amount = quoted_amount ? `$${Number(quoted_amount).toLocaleString()}` : "Not quoted";

    if (bt === "flat_rate") {
      billingBreakdown = `<tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Flat Rate</td><td style="padding:6px 12px;color:#fff">${amount} → Operating Account (firm property immediately)</td></tr>`;
    } else if (bt === "hourly_trust") {
      const deposit = trust_deposit ? `$${Number(trust_deposit).toLocaleString()}` : "TBD";
      const rate = hourly_rate ? `$${Number(hourly_rate).toLocaleString()}/hr` : "TBD";
      billingBreakdown = `
        <tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Advanced Fee Deposit</td><td style="padding:6px 12px;color:#fff">${deposit} → IOLTA Trust Account</td></tr>
        <tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Hourly Rate</td><td style="padding:6px 12px;color:#fff">${rate} — billed every 2-4 weeks, drawn from trust</td></tr>`;
    } else if (bt === "true_retainer") {
      billingBreakdown = `<tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">True Retainer</td><td style="padding:6px 12px;color:#fff">${amount} → Operating Account (firm property immediately)</td></tr>`;
    } else if (bt === "contingency") {
      const pct = contingency_pct ? `${contingency_pct}%` : "TBD";
      billingBreakdown = `<tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Contingency</td><td style="padding:6px 12px;color:#fff">${pct} of award/settlement — no upfront payment from client</td></tr>`;
    } else if (bt === "combination") {
      const deposit = trust_deposit ? `$${Number(trust_deposit).toLocaleString()}` : "TBD";
      const rate = hourly_rate ? `$${Number(hourly_rate).toLocaleString()}/hr` : "";
      const pct = contingency_pct ? `${contingency_pct}%` : "";
      billingBreakdown = `
        <tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Total Quoted</td><td style="padding:6px 12px;color:#fff">${amount}</td></tr>
        ${deposit !== "TBD" ? `<tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Trust Deposit</td><td style="padding:6px 12px;color:#fff">${deposit} → IOLTA Trust Account</td></tr>` : ""}
        ${rate ? `<tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Hourly Rate</td><td style="padding:6px 12px;color:#fff">${rate}</td></tr>` : ""}
        ${pct ? `<tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Contingency</td><td style="padding:6px 12px;color:#fff">${pct} of award/settlement</td></tr>` : ""}`;
    } else {
      billingBreakdown = `<tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Amount</td><td style="padding:6px 12px;color:#fff">${amount}</td></tr>
        <tr><td style="padding:6px 12px;color:#c9a84c;font-weight:bold">Billing Type</td><td style="padding:6px 12px;color:#fff">${bt.replace(/_/g, " ")}</td></tr>`;
    }

    const html = `
    <div style="background:#0a1628;padding:32px;font-family:Arial,sans-serif">
      <h2 style="color:#c9a84c;margin:0 0 8px">New Client Billing</h2>
      <p style="color:#8b90a7;font-size:13px;margin:0 0 24px">A new client has been onboarded</p>

      <table style="width:100%;border-collapse:collapse;background:#000;border:1px solid #1a2a44;margin-bottom:16px">
        <tr><td style="padding:8px 12px;color:#c9a84c;font-weight:bold;width:140px">Client</td><td style="padding:8px 12px;color:#fff">${client_name}</td></tr>
        ${email ? `<tr><td style="padding:8px 12px;color:#c9a84c;font-weight:bold">Email</td><td style="padding:8px 12px;color:#fff">${email}</td></tr>` : ""}
        ${phone ? `<tr><td style="padding:8px 12px;color:#c9a84c;font-weight:bold">Phone</td><td style="padding:8px 12px;color:#fff">${phone}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;color:#c9a84c;font-weight:bold">Case Type</td><td style="padding:8px 12px;color:#fff">${(case_type || "Not specified").replace(/_/g, " ")}</td></tr>
      </table>

      <h3 style="color:#c9a84c;margin:0 0 8px;font-size:16px">Billing Breakdown</h3>
      <table style="width:100%;border-collapse:collapse;background:#000;border:1px solid #1a2a44;margin-bottom:16px">
        ${billingBreakdown}
      </table>

      ${case_description ? `
      <h3 style="color:#c9a84c;margin:0 0 8px;font-size:16px">Scope of Work</h3>
      <div style="background:#000;border:1px solid #1a2a44;padding:12px;color:#fff;font-size:14px;white-space:pre-wrap">${case_description}</div>
      ` : ""}

      <p style="color:#666;font-size:12px;margin-top:24px">
        Generated by JDL Law CRM at ${new Date().toLocaleString()}
      </p>
    </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "JDL Law CRM <billing@justindleigh.com>",
        to: ["jdllaw.admin@gmail.com"],
        subject: `New Client Billing — ${client_name}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) return json(res.status, { error: "Email failed", details: data });

    return json(200, { success: true, email_id: data.id });
  } catch (err) {
    return json(500, { error: err.message });
  }
});

function cors() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors() } });
}
