// One-off backfill: for every quo MESSAGE lead with empty message text,
// extract the message id from the email field and fetch the text from Quo API.
//
// Deploy: cd law-site && npx supabase functions deploy backfill-quo-messages --no-verify-jwt
// Run:    curl -X POST https://gpckxhsiawummkkegeix.supabase.co/functions/v1/backfill-quo-messages

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const QUO_API = "https://api.openphone.com/v1";

Deno.serve(async (_req) => {
  try {
    const quoKey = Deno.env.get("QUO_API_KEY");
    if (!quoKey) return res(500, { error: "QUO_API_KEY not set" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Find quo message leads with empty/null message text.
    const { data: leads, error } = await supabase
      .from("contact_submissions")
      .select("id, email, message")
      .eq("lead_source", "quo")
      .eq("lead_type", "message")
      .or("message.is.null,message.eq.");

    if (error) return res(500, { error: error.message });
    if (!leads || leads.length === 0) return res(200, { message: "No empty messages to backfill", checked: 0 });

    let updated = 0;
    let failed = 0;
    const errors: string[] = [];
    const headers = { Authorization: quoKey };

    for (const lead of leads) {
      // email format: quo-msg-{msgId}@message.justindleigh.com
      const m = (lead.email || "").match(/^quo-msg-([\w-]+)@/);
      const msgId = m?.[1];
      if (!msgId) { failed++; errors.push(`${lead.id}: no msgId in email`); continue; }

      try {
        const r = await fetch(`${QUO_API}/messages/${msgId}`, { headers });
        if (!r.ok) {
          failed++;
          errors.push(`${lead.id} (${msgId}): http ${r.status}`);
          continue;
        }
        const body = await r.json();
        const msg = body.data || body;
        const text = msg.text || msg.body || msg.content || "";

        if (!text) {
          failed++;
          errors.push(`${lead.id} (${msgId}): no text in API response`);
          continue;
        }

        await supabase.from("contact_submissions").update({ message: text }).eq("id", lead.id);
        updated++;
      } catch (e: any) {
        failed++;
        errors.push(`${lead.id}: ${e.message}`);
      }
    }

    return res(200, {
      total_empty: leads.length,
      updated,
      failed,
      errors: errors.slice(0, 20),
    });
  } catch (err: any) {
    return res(500, { error: err.message });
  }
});

function res(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
