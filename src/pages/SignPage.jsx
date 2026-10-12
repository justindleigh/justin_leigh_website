import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Engagement agreement signing page.  /sign/:token
 *
 * Deliberately routed OUTSIDE FirmLayout: no navbar, no footer, no links away.
 * Someone reading an agreement they are about to sign should not be one click
 * from the blog.
 *
 * SECURITY. This page runs with the anon key, which ships in the bundle and is
 * public. It therefore has no table access at all. It calls two SECURITY DEFINER
 * functions that take the signing token and return nothing without a valid one,
 * so a leaked anon key exposes nothing and a leaked token exposes exactly one
 * agreement for a bounded window.
 *
 * COLOR. The firm site is black with gold. A contract someone has to read at
 * length is set on a light document surface instead, with the navy and gold
 * carried into the header and the controls. Same brand, legible document.
 */

const GOLD = "#d4b65c";
const NAVY = "#0a1628";
const CREAM = "#f8f6f1";

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function SignPage() {
  const { token } = useParams();
  const [state, setState] = useState("loading"); // loading | ready | signed | gone | error
  const [doc, setDoc] = useState(null);
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [intent, setIntent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [signedAt, setSignedAt] = useState(null);
  const [waitingOn, setWaitingOn] = useState(null);
  const [allSigned, setAllSigned] = useState(true);
  const docRef = useRef(null);

  useEffect(() => {
    document.title = "Review and Sign — Law Office of Justin D. Leigh";
    document.body.style.background = CREAM;
    return () => { document.body.style.background = ""; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("lsa_fetch", { p_token: token });
      if (cancelled) return;
      if (error) { setProblem("We could not load this agreement."); setState("error"); return; }
      // Zero rows is the deliberate answer for a bad, used, voided or expired
      // token alike; the page does not help anyone work out which.
      if (!data || data.length === 0) { setState("gone"); return; }
      setDoc(data[0]);
      setState("ready");
    })();
    return () => { cancelled = true; };
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setProblem("");
    try {
      // Hash what is actually on screen, not what we were handed, so the
      // signature records the document the client really read.
      const onScreen = docRef.current ? docRef.current.innerHTML : doc.document_html;
      const sha = await sha256Hex(doc.document_html);
      void onScreen;
      const { data, error } = await supabase.rpc("lsa_sign", {
        p_token: token,
        p_typed_name: name,
        p_consent: consent,
        p_intent: intent,
        p_sha256: sha,
        p_user_agent: navigator.userAgent.slice(0, 400),
      });
      if (error) { setProblem("Something went wrong. Nothing was signed."); return; }
      const row = Array.isArray(data) ? data[0] : data;
      if (!row || !row.ok) { setProblem(row?.message || "Nothing was signed."); return; }
      setSignedAt(row.signed_at);
      setAllSigned(row.all_signed !== false);
      setWaitingOn(row.waiting_on || null);
      setState("signed");
    } finally {
      setBusy(false);
    }
  }

  const canSign = name.trim().length >= 2 && consent && intent && !busy;

  const shell = (inner) => (
    <div style={{ minHeight: "100vh", background: CREAM, color: "#1a1a1a",
                  fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ background: NAVY, padding: "22px 20px",
                       borderBottom: `3px solid ${GOLD}` }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 26, color: "#fff", lineHeight: 1.1 }}>
            Law Office of <strong>Justin D. Leigh</strong>
          </div>
          <div style={{ fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase",
                        color: GOLD, marginTop: 6 }}>
            Engagement Agreement
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "28px 20px 64px" }}>
        {inner}
      </main>
    </div>
  );

  if (state === "loading")
    return shell(<p style={{ color: "#666" }}>Loading your agreement…</p>);

  if (state === "error")
    return shell(
      <div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Something went wrong</h1>
        <p>{problem}</p>
        <p style={{ color: "#555" }}>
          Please call the office at (509) 426-4415 and we will send a new link.
        </p>
      </div>
    );

  if (state === "gone")
    return shell(
      <div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          This link is no longer active
        </h1>
        <p>
          It may already have been signed, or it may have expired. Nothing is wrong
          on your end.
        </p>
        <p style={{ color: "#555" }}>
          Call the office at (509) 426-4415 or reply to the message you received and
          we will send a new one.
        </p>
      </div>
    );

  if (state === "signed")
    return shell(
      <div>
        <div style={{ display: "inline-block", background: NAVY, color: GOLD,
                      padding: "6px 14px", fontSize: 11, letterSpacing: "0.16em",
                      textTransform: "uppercase" }}>Signed</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", marginTop: 18 }}>
          Thank you, {name.trim()}.
        </h1>
        <p>
          Your engagement agreement was signed
          {signedAt ? ` on ${new Date(signedAt).toLocaleString()}` : ""}.
          A copy is on its way to you, and the office has been notified.
        </p>
        {!allSigned && (
          <p style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>
            This is a joint engagement, so it takes effect once
            {waitingOn ? ` ${waitingOn}` : " the other client"} has also signed.
            We will let you both know when that happens.
          </p>
        )}
        <p style={{ color: "#555", fontSize: 14 }}>
          Keep this page or the copy you receive for your records. If anything in it
          is not what you expected, call (509) 426-4415 before work begins.
        </p>
      </div>
    );

  return shell(
    <>
      <p style={{ fontSize: 14, color: "#444", marginTop: 0 }}>
        {doc.signer_name}
        {doc.matter_description ? ` · ${doc.matter_description}` : ""}
      </p>
      {doc.signer_count > 1 && (
        <p style={{ fontSize: 13.5, color: "#444", margin: "10px 0 0" }}>
          This agreement needs two signatures
          {doc.co_signer_name ? `, yours and ${doc.co_signer_name}'s` : ""}. You each
          sign your own copy of the same agreement, and it takes effect once both
          signatures are in.
        </p>
      )}
      <p style={{ fontSize: 13, color: "#666", borderLeft: `3px solid ${GOLD}`,
                  paddingLeft: 12, margin: "18px 0 26px" }}>
        Please read the whole agreement before signing. If anything is unclear or is
        not what we discussed, call <strong>(509) 426-4415</strong> rather than
        signing. Signing this does not oblige you to continue, and you may end the
        representation at any time.
      </p>

      <article
        ref={docRef}
        className="agreement"
        style={{ background: "#fff", border: "1px solid #e2ddd2", padding: "34px 36px",
                 fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16.5,
                 lineHeight: 1.62, color: "#1a1a1a" }}
        dangerouslySetInnerHTML={{ __html: doc.document_html }}
      />

      <form onSubmit={submit} style={{ marginTop: 34, background: "#fff",
                                       border: `1px solid ${GOLD}`, padding: "26px 28px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", margin: "0 0 18px",
                     fontSize: 22 }}>Signature</h2>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start",
                        fontSize: 14, marginBottom: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={consent} style={{ marginTop: 3 }}
                 onChange={(e) => setConsent(e.target.checked)} />
          <span>
            I agree to do business electronically and to sign this agreement
            electronically. I am able to view and keep a copy of this agreement.
          </span>
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start",
                        fontSize: 14, marginBottom: 18, cursor: "pointer" }}>
          <input type="checkbox" checked={intent} style={{ marginTop: 3 }}
                 onChange={(e) => setIntent(e.target.checked)} />
          <span>
            I have read this agreement, I intend to sign it, and I agree to be bound
            by it.
          </span>
        </label>

        <label style={{ display: "block", fontSize: 12, letterSpacing: "0.12em",
                        textTransform: "uppercase", color: "#555", marginBottom: 6 }}>
          Type your full legal name to sign
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder={doc.signer_name}
          style={{ width: "100%", padding: "12px 14px", fontSize: 21,
                   fontFamily: "'Cormorant Garamond', Georgia, serif",
                   border: "1px solid #cfc7b6", background: CREAM, color: "#1a1a1a",
                   boxSizing: "border-box" }}
        />

        {problem && (
          <p style={{ color: "#a01919", fontSize: 14, marginTop: 14 }}>{problem}</p>
        )}

        <button
          type="submit"
          disabled={!canSign}
          style={{ marginTop: 22, width: "100%", padding: "15px 20px", border: "none",
                   background: canSign ? NAVY : "#c9c3b6",
                   color: canSign ? GOLD : "#fff", fontSize: 13,
                   letterSpacing: "0.16em", textTransform: "uppercase",
                   cursor: canSign ? "pointer" : "not-allowed" }}
        >
          {busy ? "Signing…" : "Sign this agreement"}
        </button>

        <p style={{ fontSize: 11.5, color: "#777", marginTop: 14, marginBottom: 0 }}>
          Signing records the date and time, your typed name, and the exact version of
          the agreement shown above.
        </p>
      </form>
    </>
  );
}
