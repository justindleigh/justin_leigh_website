// Supabase Edge Function: quo-health-check
// Compares Quo (OpenPhone) conversation activity against what's in our DB.
// Drift = conversations Quo says had activity that we didn't capture.
//
// Note: OpenPhone's /v1/calls and /v1/messages list endpoints require participants[]
// which we can't enumerate. /v1/conversations works without it and gives us a per-channel
// activity timestamp that we can compare to our DB.
//
// Deploy: cd law-site && npx supabase functions deploy quo-health-check --no-verify-jwt
// Test:   curl -X POST https://gpckxhsiawummkkegeix.supabase.co/functions/v1/quo-health-check

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const QUO_API = "https://api.openphone.com/v1";
const WINDOW_DAYS = 7;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors() });

  try {
    const quoKey = Deno.env.get("QUO_API_KEY");
    if (!quoKey) return res(500, { error: "QUO_API_KEY not set" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const sinceMs = Date.now() - WINDOW_DAYS * 86400000;
    const sinceIso = new Date(sinceMs).toISOString();
    const headers = { Authorization: quoKey };

    // 1. Get all phone numbers on the Quo account.
    const phoneNumbersRes = await fetch(`${QUO_API}/phone-numbers`, { headers });
    if (!phoneNumbersRes.ok) {
      return res(phoneNumbersRes.status, {
        error: "Failed to list Quo phone numbers",
        status: phoneNumbersRes.status,
        body: (await phoneNumbersRes.text()).substring(0, 300),
      });
    }
    const phoneNumbersData = await phoneNumbersRes.json();
    const phoneNumbers = (phoneNumbersData.data || []).map((p: any) => ({
      id: p.id,
      number: p.phoneNumber || p.number,
      name: p.name,
    }));

    if (phoneNumbers.length === 0) {
      return res(200, {
        warning: "No phone numbers found on Quo account",
        healthy: false,
      });
    }

    // 2. Iterate conversations across all numbers and count those with activity in window.
    let quoActiveConversations = 0;
    let quoTotalConversations = 0;
    const errors: string[] = [];

    for (const pn of phoneNumbers) {
      try {
        let pageToken: string | undefined = undefined;
        let pageCount = 0;
        // Cap pages to prevent runaway loops.
        do {
          const url = new URL(`${QUO_API}/conversations`);
          url.searchParams.set("phoneNumberId", pn.id);
          url.searchParams.set("maxResults", "50");
          if (pageToken) url.searchParams.set("pageToken", pageToken);

          const r = await fetch(url.toString(), { headers });
          if (!r.ok) {
            errors.push(`conversations ${pn.number}: http ${r.status} ${(await r.text()).substring(0, 100)}`);
            break;
          }
          const body = await r.json();
          const items = body.data || [];
          quoTotalConversations += items.length;

          for (const conv of items) {
            // OpenPhone conversation has lastActivityAt timestamp
            const lastActiveStr = conv.lastActivityAt || conv.updatedAt;
            if (!lastActiveStr) continue;
            const lastActiveMs = new Date(lastActiveStr).getTime();
            if (lastActiveMs >= sinceMs) {
              quoActiveConversations++;
            } else {
              // Conversations come back ordered desc by activity; once we pass the window, stop.
              pageToken = undefined;
              break;
            }
          }

          pageToken = body.nextPageToken || undefined;
          pageCount++;
        } while (pageToken && pageCount < 20);
      } catch (e: any) {
        errors.push(`conversations ${pn.number}: ${e.message}`);
      }
    }

    // 3. Count Quo-tagged inbound rows in our DB for the same window.
    const { count: dbCalls } = await supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("lead_source", "quo")
      .eq("lead_type", "call")
      .gte("created_at", sinceIso);

    const { count: dbMessages } = await supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("lead_source", "quo")
      .eq("lead_type", "message")
      .gte("created_at", sinceIso);

    // A conversation = call OR message thread. Our DB stores each event as a row.
    // So our DB count will normally be >= Quo conversation count (multiple events per convo).
    // Drift definition: conversations active on Quo without any matching DB row in window.
    const dbTotal = (dbCalls || 0) + (dbMessages || 0);

    // Health check is honest:
    //  - If we got API errors, NOT healthy.
    //  - If Quo had active conversations but we have zero DB rows, NOT healthy.
    //  - Otherwise healthy.
    const apiOk = errors.length === 0;
    const noBlackHole = quoActiveConversations === 0 || dbTotal > 0;
    const healthy = apiOk && noBlackHole;

    return res(200, {
      window_days: WINDOW_DAYS,
      since: sinceIso,
      phone_numbers: phoneNumbers.length,
      quo: {
        active_conversations: quoActiveConversations,
        total_conversations_seen: quoTotalConversations,
      },
      db: { calls: dbCalls || 0, messages: dbMessages || 0, total: dbTotal },
      healthy,
      issue: !apiOk ? "Quo API call failed" : !noBlackHole ? "Quo had activity but our DB shows none" : null,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    return res(500, { error: err.message });
  }
});

function res(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...cors() },
  });
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
