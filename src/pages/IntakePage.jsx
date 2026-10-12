import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Intake questionnaire.  /intake/:token
 *
 * Routed OUTSIDE FirmLayout for the same reason the signing page is: somebody
 * typing out what happened to them should not be one click from the blog.
 *
 * SECURITY. Runs on the anon key, which ships in the bundle and is public, and
 * therefore has no table access at all. Two SECURITY DEFINER functions take the
 * token and return nothing without a valid one, so a leaked key exposes
 * nothing and a leaked token exposes one form for a bounded window.
 *
 * WRITTEN FOR A PHONE. Most of these arrive by text and get filled in standing
 * up. One question per block, inputs big enough to hit, nothing that needs
 * pinching to read, and the whole thing works in one hand.
 */

const GOLD = "#d4b65c";
const NAVY = "#0a1628";
const CREAM = "#f8f6f1";

export default function IntakePage() {
  const { token } = useParams();
  const [state, setState] = useState("loading"); // loading|ready|done|gone|error
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  // Nothing is "missing" until she has tried to send. A form that opens
  // covered in red boxes reads as broken before she has typed a word.
  const [tried, setTried] = useState(false);

  useEffect(() => {
    document.title = "Client Intake — Law Office of Justin D. Leigh";
  }, []);

  useEffect(() => {
    let dead = false;
    (async () => {
      const { data, error } = await supabase.rpc("intake_fetch", { p_token: token });
      if (dead) return;
      if (error) { setState("error"); return; }
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) { setState("gone"); return; }
      if (row.out_submitted) { setState("done"); return; }
      setForm({
        areaLabel: row.out_area_label,
        questions: row.out_questions || [],
        consentText: row.out_consent_text || "",
        expiresAt: row.out_expires_at,
      });
      setState("ready");
    })();
    return () => { dead = true; };
  }, [token]);

  function set(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const missing = (form?.questions || [])
    .filter((q) => q.required && !(answers[q.key] || "").trim())
    .map((q) => q.key);

  async function submit() {
    setProblem("");
    setTried(true);
    if (!consent) { setProblem("Please read the notice and tick the box before sending."); return; }
    if (missing.length) {
      setProblem("A few answers are still blank. They are marked below.");
      const el = document.getElementById("q-" + missing[0]);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    const payload = {};
    for (const q of form.questions) {
      const v = (answers[q.key] || "").trim();
      // The question travels with the answer. An answer alone stops meaning
      // anything the moment the question bank is edited.
      if (v) payload[q.key] = { question: q.label, answer: v };
    }
    const { data, error } = await supabase.rpc("intake_submit", {
      p_token: token,
      p_answers: payload,
      p_consent: true,
      p_ua: navigator.userAgent.slice(0, 300),
    });
    setBusy(false);
    if (error) { setProblem("That did not send. Please try once more, or call (509) 426-4415."); return; }
    if (data === false) { setState("gone"); return; }
    setState("done");
  }

  const shell = (children) => (
    <div style={{ minHeight: "100vh", background: NAVY, padding: "0 0 64px" }}>
      <div style={{ background: NAVY, borderBottom: `2px solid ${GOLD}`, padding: "18px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ color: CREAM, fontSize: 19, fontWeight: 600, letterSpacing: 0.2 }}>
            Law Office of <span style={{ color: GOLD }}>Justin D. Leigh</span>
          </div>
          <div style={{ color: GOLD, fontSize: 10.5, letterSpacing: 2, textTransform: "uppercase", marginTop: 3 }}>
            Client Intake
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>{children}</div>
    </div>
  );

  const card = (inner) => (
    <div style={{
      background: CREAM, borderRadius: 14, padding: "26px 22px", marginTop: 22,
      color: "#1b2330", fontSize: 16, lineHeight: 1.6,
    }}>{inner}</div>
  );

  if (state === "loading") return shell(card(<p style={{ margin: 0 }}>Loading your form...</p>));

  if (state === "error" || state === "gone")
    return shell(card(
      <>
        <p style={{ margin: "0 0 10px", fontWeight: 600 }}>This link is no longer active.</p>
        <p style={{ margin: 0 }}>
          It may have expired, or it may already have been sent in. Nothing is wrong on your end.
          Call the office at <a href="tel:+15094264415" style={{ color: NAVY }}>(509) 426-4415</a> and
          we will sort it out.
        </p>
      </>
    ));

  if (state === "done")
    return shell(card(
      <>
        <p style={{ margin: "0 0 10px", fontWeight: 600 }}>Thank you, that has come through.</p>
        <p style={{ margin: 0 }}>
          I will read it and get back to you. If anything changes in the meantime, or you
          remember something you left out, call me at{" "}
          <a href="tel:+15094264415" style={{ color: NAVY }}>(509) 426-4415</a>.
        </p>
      </>
    ));

  return shell(
    <>
      {card(
        <>
          <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 17 }}>{form.areaLabel}</p>
          <p style={{ margin: 0, fontSize: 15, color: "#44506a" }}>
            Answer what you can. If you do not know something, say so or leave it
            blank. Nothing here is a commitment, and you can call me instead at any
            point on <a href="tel:+15094264415" style={{ color: NAVY }}>(509) 426-4415</a>.
          </p>
        </>
      )}

      {form.questions.map((q) => {
        const blank = tried && missing.includes(q.key);
        return (
          <div key={q.key} id={"q-" + q.key} style={{
            background: CREAM, borderRadius: 14, padding: "20px 22px", marginTop: 14,
            border: blank ? "2px solid #b4453a" : "2px solid transparent",
          }}>
            <label style={{ display: "block", color: "#1b2330", fontSize: 16, fontWeight: 600, lineHeight: 1.45 }}>
              {q.label}
              {q.required && <span style={{ color: "#b4453a" }}> *</span>}
            </label>
            {q.from_attorney && (
              <div style={{ color: "#6b5a1f", fontSize: 12.5, marginTop: 4, fontStyle: "italic" }}>
                Asked specifically about your matter
              </div>
            )}
            {q.help && (
              <div style={{ color: "#5a6578", fontSize: 13.5, marginTop: 6, lineHeight: 1.5 }}>{q.help}</div>
            )}
            {q.type === "textarea" ? (
              <textarea
                rows={4}
                value={answers[q.key] || ""}
                onChange={(e) => set(q.key, e.target.value)}
                style={{
                  width: "100%", marginTop: 10, padding: "12px 12px", fontSize: 16,
                  lineHeight: 1.5, borderRadius: 9, border: "1px solid #c9c2ae",
                  background: "#fff", color: "#1b2330", fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            ) : (
              <input
                type="text"
                value={answers[q.key] || ""}
                onChange={(e) => set(q.key, e.target.value)}
                style={{
                  width: "100%", marginTop: 10, padding: "12px 12px", fontSize: 16,
                  borderRadius: 9, border: "1px solid #c9c2ae", background: "#fff",
                  color: "#1b2330", fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            )}
          </div>
        );
      })}

      {card(
        <>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.65 }}>{form.consentText}</div>
          <label style={{
            display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18,
            fontSize: 15.5, cursor: "pointer",
          }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
              style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0 }} />
            <span>I have read this and I want to send my information.</span>
          </label>

          {problem && (
            <p style={{ color: "#b4453a", fontSize: 14.5, marginTop: 14, marginBottom: 0 }}>{problem}</p>
          )}

          <button type="button" onClick={submit} disabled={busy}
            style={{
              width: "100%", marginTop: 18, padding: "15px 16px", fontSize: 16,
              fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
              borderRadius: 10, border: "none", cursor: busy ? "default" : "pointer",
              background: consent ? GOLD : "#cfc8b4", color: NAVY,
            }}>
            {busy ? "Sending..." : "Send to Justin"}
          </button>
          <p style={{ fontSize: 12.5, color: "#5a6578", marginTop: 12, marginBottom: 0 }}>
            Sent straight to the firm. Nobody else sees it.
          </p>
        </>
      )}
    </>
  );
}
