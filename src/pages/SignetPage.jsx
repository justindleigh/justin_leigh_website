import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Signet: sign any PDF the firm issues.  /signet/:token
 *
 * The engagement-agreement page (/sign/:token) signs HTML the firm generated.
 * This one signs a PDF anybody made, shown as the PDF itself, page by page, with
 * the signer's own spots marked where their signature will go.
 *
 * SECURITY is the /sign model. The anon key ships in the bundle, so the page has
 * no table access. It calls two SECURITY DEFINER functions keyed on the token.
 * The PDF sits in a private bucket and is reached only through the signed URL
 * signet_fetch hands to a valid token.
 *
 * WHAT IS PINNED. The page hashes the exact bytes it downloaded and rendered,
 * refuses to show a document whose hash is not the one on file, and sends that
 * hash with the signature. The database refuses a signature with any other.
 */

const NAVY = "#0C2C56";
const TEAL = "#005C5C";
const TEAL_MID = "#00818A";
const SLATE = "#5A6670";
const MIST = "#EEF2F3";
const SILVER = "#C4CED4";
const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "Manrope, Helvetica, Arial, sans-serif";
const SCRIPT = "'Dancing Script', cursive";
const OFFICE_PHONE = "(509) 426-4415";
const FIRM = "Law Office of Justin D. Leigh";

/**
 * Who sent this. Justin, 2026-11-17: Signet may say "Powered by Evergreen
 * Legal AI", but the page must assure the signer it is being sent by him and
 * not by something else. A signing link is exactly what a phishing email
 * imitates, so the panel names the attorney and the office and tells the
 * reader the two checks that actually prove it: the address bar, and a call
 * to a number they can look up independently.
 */
function SenderCard() {
  return (
    <section aria-label="Who sent this document"
             style={{ background: "#fff", border: `1px solid ${SILVER}`,
                      borderLeft: `4px solid ${NAVY}`, padding: "14px 16px",
                      margin: "0 0 20px", fontSize: 13.5, lineHeight: 1.5 }}>
      <div style={{ fontSize: 10.5, letterSpacing: "0.24em", textTransform: "uppercase",
                    color: TEAL, fontWeight: 700, marginBottom: 4 }}>From</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, fontSize: 21,
                    lineHeight: 1.2 }}>{FIRM}</div>
      <div style={{ color: "#33414d" }}>
        Justin D. Leigh, PLLC d/b/a {FIRM}
      </div>
      <div style={{ color: "#33414d" }}>
        Justin D. Leigh, Attorney at Law · WSBA No. 55307
      </div>
      <div style={{ color: SLATE }}>
        601 W. 1st Ave., Ste. 1400, Spokane, WA 99201 · {OFFICE_PHONE}
      </div>
      <p style={{ margin: "10px 0 0", color: "#33414d", fontSize: 13 }}>
        This document was sent to you by Justin D. Leigh's law office. To confirm it,
        check that your browser's address bar shows <strong>justindleigh.com</strong>. If
        you were not expecting it, call the office before you sign.
      </p>
    </section>
  );
}

async function sha256Hex(buf) {
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function useHead() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Signet · Review and Sign";
    const added = [];
    const add = (tag, attrs) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      added.push(el);
    };
    add("meta", { name: "robots", content: "noindex, nofollow" });
    add("meta", { name: "referrer", content: "no-referrer" });
    add("link", { rel: "icon", href: "/brand/signet/favicon/favicon.svg", type: "image/svg+xml" });
    add("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" });
    add("link", {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Manrope:wght@400;600;700&family=Dancing+Script:wght@400&display=swap",
    });
    document.body.style.background = MIST;
    return () => {
      document.title = prevTitle;
      added.forEach((el) => el.remove());
      document.body.style.background = "";
    };
  }, []);
}

function PdfPages({ bytes, fields, signedName, initials, values }) {
  const wrap = useRef(null);
  const [pages, setPages] = useState([]); // [{w, h}] in PDF points
  const [width, setWidth] = useState(0);
  const canvases = useRef([]);
  const pdfRef = useRef(null);

  // Load the document once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pdfjs = await import("pdfjs-dist");
      const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
      pdfjs.GlobalWorkerOptions.workerSrc = worker;
      // pdf.js transfers the buffer it is given; hand it a copy so the bytes
      // the hash was taken from are never detached underneath us.
      const doc = await pdfjs.getDocument({ data: bytes.slice(0) }).promise;
      if (cancelled) return;
      pdfRef.current = doc;
      const dims = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const p = await doc.getPage(i);
        const v = p.getViewport({ scale: 1 });
        dims.push({ w: v.width, h: v.height });
      }
      if (!cancelled) setPages(dims);
    })();
    return () => { cancelled = true; };
  }, [bytes]);

  // Track the column width so pages fit a phone as well as a desktop.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Draw each page at the current width.
  useEffect(() => {
    const doc = pdfRef.current;
    if (!doc || !width || !pages.length) return;
    let cancelled = false;
    (async () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      for (let i = 0; i < pages.length; i++) {
        if (cancelled) return;
        const c = canvases.current[i];
        if (!c) continue;
        const page = await doc.getPage(i + 1);
        const scale = width / pages[i].w;
        const vp = page.getViewport({ scale: scale * dpr });
        c.width = Math.floor(vp.width);
        c.height = Math.floor(vp.height);
        await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
      }
    })();
    return () => { cancelled = true; };
  }, [width, pages]);

  return (
    <div ref={wrap} style={{ width: "100%" }}>
      {pages.length === 0 && <p style={{ color: SLATE }}>Loading the document…</p>}
      {pages.map((d, i) => {
        const scale = width / d.w || 0;
        const mine = (fields || []).filter((f) => f.page === i);
        return (
          <div key={i} style={{ position: "relative", width: "100%", marginBottom: 14,
                                 boxShadow: "0 1px 3px rgba(12,44,86,.18)", background: "#fff" }}>
            <canvas ref={(el) => (canvases.current[i] = el)}
                    style={{ width: "100%", height: d.h * scale, display: "block" }}
                    aria-label={`Page ${i + 1} of ${pages.length}`} />
            {mine.map((f, k) => {
              const kind = f.kind || "signature";
              const boxH = (f.y1 - f.y0) * scale;
              let shown = null;
              if (kind === "signature" && signedName) shown = (
                <span style={{ fontFamily: SCRIPT, color: NAVY, whiteSpace: "nowrap",
                               fontSize: Math.max(10, boxH * 0.72), lineHeight: 1.05 }}>{signedName}</span>);
              else if (kind === "initials" && initials) shown = (
                <span style={{ fontFamily: SCRIPT, color: NAVY, whiteSpace: "nowrap",
                               fontSize: Math.max(9, boxH * 0.95), lineHeight: 1 }}>{initials}</span>);
              else if (kind === "text" && values?.[f.id]) shown = (
                <span style={{ fontFamily: "'Times New Roman', Times, serif", color: NAVY,
                               whiteSpace: "nowrap", fontSize: Math.max(8, boxH * 0.78),
                               lineHeight: 1 }}>{values[f.id]}</span>);
              const tag = kind === "date" ? "DATE" : kind === "initials" ? "INITIAL"
                : kind === "text" ? (f.label || "FILL IN").toUpperCase() : "SIGN HERE";
              return (
                <div key={k} style={{
                  position: "absolute", left: f.x0 * scale, top: f.y0 * scale,
                  width: (f.x1 - f.x0) * scale, height: (f.y1 - f.y0) * scale,
                  border: `1.5px dashed ${TEAL_MID}`, background: "rgba(92,198,192,.16)",
                  display: "flex", alignItems: "flex-end", overflow: "hidden",
                  padding: "0 4px", boxSizing: "border-box" }}>
                  {shown || (
                    <span style={{ fontFamily: BODY, color: TEAL, fontWeight: 700,
                                   letterSpacing: ".04em", alignSelf: "center", whiteSpace: "nowrap",
                                   fontSize: Math.max(6, Math.min(11, boxH * 0.62, 9 * scale)) }}>
                      {tag}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const LABEL = { display: "block", fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase",
                color: SLATE, margin: "20px 0 6px", fontWeight: 600 };
const INPUT = { width: "100%", padding: "10px 12px", fontSize: 16, fontFamily: BODY,
                border: `1px solid ${SILVER}`, background: MIST, color: "#1b2733",
                boxSizing: "border-box" };

export default function SignetPage() {
  useHead();
  const { token } = useParams();
  const [state, setState] = useState("loading"); // loading | ready | signed | gone | error
  const [doc, setDoc] = useState(null);
  const [bytes, setBytes] = useState(null);
  const [sha, setSha] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [initials, setInitials] = useState("");
  const [initialsTouched, setInitialsTouched] = useState(false);
  const [values, setValues] = useState({});
  const [consent, setConsent] = useState(false);
  const [intent, setIntent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("signet_fetch", {
        p_token: token, p_user_agent: navigator.userAgent.slice(0, 400),
      });
      if (cancelled) return;
      if (error) { setProblem("We could not load this document."); setState("error"); return; }
      if (!data || data.length === 0) { setState("gone"); return; }
      const d = data[0];
      try {
        const res = await fetch(d.pdf_url, { referrerPolicy: "no-referrer" });
        if (!res.ok) throw new Error("download");
        const buf = await res.arrayBuffer();
        const h = await sha256Hex(buf);
        if (cancelled) return;
        if (h !== d.pdf_sha256) {
          setProblem("The document did not download intact, so it cannot be signed.");
          setState("error");
          return;
        }
        setDoc(d);
        // Prefill the address on file, but never a placeholder: a link sent
        // by text is issued without one.
        if (d.signer_email && !/@example\.(com|org|net)$/i.test(d.signer_email)) {
          setEmail(d.signer_email);
        }
        setBytes(buf);
        setSha(h);
        setState("ready");
      } catch {
        if (!cancelled) { setProblem("We could not load this document."); setState("error"); }
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setProblem("");
    try {
      const { data, error } = await supabase.rpc("signet_sign", {
        p_token: token,
        p_typed_name: name,
        p_consent: consent,
        p_intent: intent,
        p_sha256: sha,
        p_user_agent: navigator.userAgent.slice(0, 400),
        p_copy_email: email.trim(),
        ...(needInitials ? { p_initials: myInitials } : {}),
        ...(textFields.length ? { p_values: filled } : {}),
      });
      if (error) { setProblem("Something went wrong. Nothing was signed."); return; }
      const row = Array.isArray(data) ? data[0] : data;
      if (!row || !row.ok) { setProblem(row?.message || "Nothing was signed."); return; }
      setResult(row);
      setState("signed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setBusy(false);
    }
  }

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const myFields = doc?.fields || [];
  const needInitials = myFields.some((f) => f.kind === "initials");
  const autoInitials = name.trim().split(/\s+/).filter(Boolean)
    .map((w) => w[0].toUpperCase()).join("").slice(0, 4);
  const myInitials = (initialsTouched ? initials : autoInitials).trim();
  const textFields = myFields.filter((f) => f.kind === "text");
  // An "Email" blank in the document starts out as the copy address; the
  // signer can change it.
  const filled = {};
  for (const f of textFields) {
    const typed = values[f.id];
    const v = typed !== undefined ? typed : (/e-?mail/i.test(f.label || "") ? email : "");
    if (v.trim()) filled[f.id] = v.trim();
  }
  const missingText = textFields.filter((f) => !f.optional && !filled[f.id]);
  const initialsOk = !needInitials || (myInitials.length >= 1 && myInitials.length <= 6);
  const canSign = doc?.your_turn && name.trim().length >= 2 && emailOk && consent && intent
    && initialsOk && missingText.length === 0 && !busy;

  const shell = (inner) => (
    <div className="signet" style={{ minHeight: "100vh", background: MIST, color: "#1b2733",
                                     fontFamily: BODY }}>
      <header style={{ background: NAVY, padding: "16px 16px", borderBottom: `3px solid ${TEAL_MID}` }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center",
                      justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <img src="/brand/signet/logo/signet-horizontal-plain-reversed.svg" alt="Signet"
               style={{ height: 34, width: "auto" }} />
          <div style={{ fontSize: 13, color: "#cfe3e6", textAlign: "right", lineHeight: 1.3 }}>
            Sent by<br />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14.5 }}>{FIRM}</span>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px 64px",
                     boxSizing: "border-box" }}>
        {inner}
      </main>
      <footer style={{ textAlign: "center", fontSize: 11.5, color: SLATE, padding: "0 16px 28px" }}>
        {FIRM} · justindleigh.com<br />
        Signet · Secure Document Execution · <em>Powered by Evergreen Legal AI</em>
      </footer>
    </div>
  );

  const h1 = (t) => (
    <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, fontSize: 30,
                 margin: "4px 0 10px", lineHeight: 1.15, textWrap: "balance" }}>{t}</h1>
  );

  if (state === "loading")
    return shell(<p style={{ color: SLATE }}>Loading your document…</p>);

  if (state === "error")
    return shell(
      <div>
        {h1("Something went wrong")}
        <p>{problem}</p>
        <p style={{ color: SLATE }}>
          Please call the office at {OFFICE_PHONE} and we will send a new link.
        </p>
      </div>
    );

  if (state === "gone")
    return shell(
      <div>
        {h1("This link is no longer active")}
        <p>It may already have been signed, or it may have expired. Nothing is wrong on your end.</p>
        <p style={{ color: SLATE }}>
          Call the office at {OFFICE_PHONE} or reply to the message you received and we will
          send a new one.
        </p>
      </div>
    );

  if (state === "signed")
    return shell(
      <div style={{ background: "#fff", border: `1px solid ${SILVER}`, padding: "28px 24px" }}>
        <div style={{ display: "inline-block", background: NAVY, color: "#5CC6C0",
                      padding: "6px 14px", fontSize: 11, letterSpacing: "0.24em",
                      textTransform: "uppercase", fontWeight: 700 }}>Signed</div>
        {h1(`Thank you, ${name.trim()}.`)}
        <p>
          You signed <strong>{doc.title}</strong>
          {result?.signed_at ? ` on ${new Date(result.signed_at).toLocaleString()}` : ""}.
        </p>
        {result?.all_signed ? (
          <p>Everyone has now signed. The executed copy, with its certificate of completion,
             will be emailed to <strong>{email.trim()}</strong>.</p>
        ) : (
          <p style={{ borderLeft: `3px solid ${TEAL_MID}`, paddingLeft: 12 }}>
            This document is still waiting on
            {result?.waiting_on ? ` ${result.waiting_on}` : " another signer"}. Once everyone
            has signed, the executed copy will be emailed to <strong>{email.trim()}</strong>.
          </p>
        )}
        <p style={{ color: SLATE, fontSize: 14 }}>
          Signet document {doc.ref} · sent by {FIRM}, {OFFICE_PHONE}
        </p>
      </div>
    );

  const others = (doc.signers || []).filter((s) => s.name !== doc.signer_name);

  return shell(
    <>
      <SenderCard />
      <div style={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase",
                    color: TEAL, fontWeight: 700 }}>Review and sign</div>
      {h1(doc.title)}
      <p style={{ fontSize: 14, color: "#33414d", margin: "0 0 6px" }}>
        For <strong>{doc.signer_name}</strong> · Signet document {doc.ref}
      </p>
      {others.length > 0 && (
        <p style={{ fontSize: 13.5, color: SLATE, margin: "0 0 6px" }}>
          Also signing: {others.map((s) => `${s.name}${s.signed ? " (signed)" : ""}`).join(", ")}.
        </p>
      )}
      {!doc.your_turn && (
        <p style={{ fontSize: 14, borderLeft: `3px solid ${TEAL_MID}`, paddingLeft: 12,
                    margin: "14px 0" }}>
          This document is signed in order, and it is waiting on {doc.waiting_on} first. You can
          read it now. This link will let you sign once that signature is in.
        </p>
      )}
      <p style={{ fontSize: 13, color: SLATE, borderLeft: `3px solid ${SILVER}`,
                  paddingLeft: 12, margin: "16px 0 22px" }}>
        Please read the whole document. Your signature goes in the marked spots. If anything is
        unclear, call <strong>{OFFICE_PHONE}</strong> before signing.
      </p>

      <PdfPages bytes={bytes} fields={doc.fields} signedName={name.trim()}
                initials={needInitials ? myInitials : ""} values={filled} />

      <form onSubmit={submit} style={{ marginTop: 26, background: "#fff",
                                       border: `1px solid ${TEAL_MID}`, padding: "24px 22px" }}>
        <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, margin: "0 0 16px",
                     fontSize: 24 }}>Signature</h2>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start",
                        fontSize: 14, marginBottom: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={consent} style={{ marginTop: 3 }}
                 onChange={(e) => setConsent(e.target.checked)} />
          <span>
            I agree to do business electronically and to sign this document electronically. I
            am able to view and keep a copy of it.
          </span>
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start",
                        fontSize: 14, marginBottom: 18, cursor: "pointer" }}>
          <input type="checkbox" checked={intent} style={{ marginTop: 3 }}
                 onChange={(e) => setIntent(e.target.checked)} />
          <span>I have read this document, and I intend to sign it.</span>
        </label>

        <label htmlFor="signet-name" style={{ display: "block", fontSize: 11.5,
                        letterSpacing: "0.16em", textTransform: "uppercase", color: SLATE,
                        marginBottom: 6, fontWeight: 600 }}>
          Type your full legal name to sign
        </label>
        <input
          id="signet-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Type your name here"
          style={{ width: "100%", padding: "12px 14px", fontSize: 18, fontFamily: BODY,
                   border: `1px solid ${SILVER}`, background: MIST, color: "#1b2733",
                   boxSizing: "border-box" }}
        />
        {name.trim().length >= 2 && (
          <div style={{ marginTop: 12, borderBottom: `1px solid ${NAVY}`, padding: "0 4px 2px",
                        fontFamily: SCRIPT, fontSize: 34, color: NAVY, lineHeight: 1.2,
                        overflow: "hidden", whiteSpace: "nowrap" }}>
            {name.trim()}
          </div>
        )}

        <label htmlFor="signet-email" style={{ display: "block", fontSize: 11.5,
                        letterSpacing: "0.16em", textTransform: "uppercase", color: SLATE,
                        margin: "20px 0 6px", fontWeight: 600 }}>
          Where should we email your signed copy?
        </label>
        <input
          id="signet-email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          style={{ width: "100%", padding: "12px 14px", fontSize: 17, fontFamily: BODY,
                   border: `1px solid ${SILVER}`, background: MIST, color: "#1b2733",
                   boxSizing: "border-box" }}
        />
        <p style={{ fontSize: 12, color: SLATE, margin: "6px 0 0" }}>
          Once everyone has signed, the executed document and its certificate are sent here.
        </p>

        {needInitials && (
          <>
            <label htmlFor="signet-initials" style={LABEL}>
              Your initials, for the {myFields.filter((f) => f.kind === "initials").length} places
              marked INITIAL
            </label>
            <input
              id="signet-initials"
              value={initialsTouched ? initials : autoInitials}
              onChange={(e) => { setInitialsTouched(true); setInitials(e.target.value.slice(0, 6)); }}
              placeholder="e.g. JDL"
              style={{ ...INPUT, width: 140, fontSize: 18 }}
            />
          </>
        )}

        {textFields.length > 0 && (
          <>
            <div style={{ ...LABEL, marginTop: 22 }}>Fill in the blanks marked in the document</div>
            {textFields.map((f) => (
              <div key={f.id} style={{ marginBottom: 10 }}>
                <label htmlFor={`signet-${f.id}`} style={{ display: "block", fontSize: 13.5,
                                color: "#33414d", marginBottom: 4 }}>
                  {f.label} <span style={{ color: SLATE }}>(page {f.page + 1}
                  {f.optional ? ", optional" : ""})</span>
                </label>
                <input
                  id={`signet-${f.id}`}
                  value={values[f.id] !== undefined ? values[f.id]
                         : (/e-?mail/i.test(f.label || "") ? email : "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value.slice(0, 300) }))}
                  style={INPUT}
                />
              </div>
            ))}
          </>
        )}

        {problem && <p style={{ color: "#a01919", fontSize: 14, marginTop: 14 }}>{problem}</p>}

        {!canSign && !busy && doc.your_turn && (
          <p style={{ color: SLATE, fontSize: 13.5, marginTop: 14 }}>
            {!consent || !intent
              ? "Tick both boxes above, type your name and your email, to sign."
              : name.trim().length < 2
                ? "Type your full name in the box above to sign."
                : !emailOk
                  ? "Enter the email address for your signed copy."
                  : !initialsOk
                    ? "Enter your initials."
                    : `Fill in: ${missingText.map((f) => f.label).join(", ")}.`}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSign}
          style={{ marginTop: 20, width: "100%", padding: "15px 20px", border: "none",
                   background: canSign ? TEAL : SILVER, color: "#fff", fontSize: 13,
                   letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
                   fontFamily: BODY, cursor: canSign ? "pointer" : "not-allowed" }}
        >
          {busy ? "Signing…" : "Sign this document"}
        </button>

        <p style={{ fontSize: 11.5, color: SLATE, marginTop: 14, marginBottom: 0 }}>
          Signing records the date and time, your typed name, your IP address and browser, and
          the exact version of the document shown above. When everyone has signed, the document
          is sealed with a digital certificate so any later change to it can be detected.
        </p>
      </form>
    </>
  );
}
