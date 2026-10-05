import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import useEvergreenHead from "../hooks/useEvergreenHead";
import "../styles/evergreen.css";

/**
 * Evergreen Legal AI, a separate trade name of Justin D. Leigh, PLLC.
 *
 * Structure, type and color follow _brand-source/evergreen/reference/index.html,
 * which is the design spec. The service copy is Justin's own, carried over from
 * the /ai page rather than invented; /ai now redirects here.
 *
 * The page renders its own header and footer and is routed outside the firm's
 * layout in App.jsx, so none of the law firm's chrome or theme reaches it.
 * Every placeholder the brand package shipped is still visible and still marked.
 */

const LOGO = "/brand/evergreen/logo";

// Carried over verbatim from the /ai page. Icons are the same line-art set.
const SERVICES = [
  {
    title: "Integration",
    desc: "Seamless integration of AI tools into your existing legal workflows and case management systems.",
    path: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    title: "Tools Strategy",
    desc: "Custom AI tool selection and deployment strategy tailored to your practice area and firm size.",
    path: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  },
  {
    title: "Training",
    desc: "Comprehensive training programs for attorneys and staff to maximize AI adoption and productivity.",
    path: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
  },
  {
    title: "Compliance",
    desc: "Ensure AI usage meets bar association ethics rules, client confidentiality requirements, and regulatory standards.",
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    title: "Auditing",
    desc: "Regular auditing of AI outputs, workflows, and data handling to maintain quality and accuracy.",
    path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4",
  },
  {
    title: "Risk Management",
    desc: "Proactive identification and mitigation of AI-related risks including bias, hallucination, and data exposure.",
    path: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  },
];

function Icon({ d }) {
  return (
    <svg className="eg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function EvergreenPage() {
  useEvergreenHead();

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [honeypot, setHoneypot] = useState("");

  // Set after mount rather than during render: calling Date.now() in a render
  // path is impure and the lint rule rejects it. Left at 0 the elapsed check
  // simply passes, which is the right way for a bot trap to fail.
  const formLoadTime = useRef(0);
  useEffect(() => { formLoadTime.current = Date.now(); }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Same submission path as the /ai form this replaces: the row lands in the
  // existing ai_inquiries table so nothing downstream has to change.
  async function handleSubmit(e) {
    e.preventDefault();
    if (honeypot) { setStatus("success"); return; }
    if (Date.now() - formLoadTime.current < 3000) { setStatus("success"); return; }

    setStatus("sending");
    try {
      await supabase.from("ai_inquiries").insert([{
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message,
        status: "new",
      }]);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
        method: "POST",
        headers: { Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "ai_inquiry" }),
      }).catch(() => {});

      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="evergreen">
      <a className="eg-skip" href="#eg-main">Skip to main content</a>

      <header className="eg-header">
        <div className="eg-wrap">
          <a href="#eg-main" aria-label="Evergreen Legal AI, home">
            <img src={`${LOGO}/evergreen-horizontal-color.svg`} alt="Evergreen Legal AI" />
          </a>
          <nav className="eg-nav" aria-label="Evergreen Legal AI">
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="#about">About</a>
            <a className="eg-btn eg-btn-primary" href="#contact">Start a conversation</a>
          </nav>
        </div>
      </header>

      <main id="eg-main">
        <section className="eg-hero">
          <img className="eg-watermark" src={`${LOGO}/evergreen-mark-white.svg`} alt="" aria-hidden="true" />
          <div className="eg-wrap">
            <p className="eg-label">Legal &middot; AI</p>
            <h1>Practical AI for the practice of law.</h1>
            <p className="eg-lede">
              I build and run AI systems inside my own law practice, and I help other firms do
              the same without taking on risk they have not thought through.
            </p>
            <p className="eg-offered">Offered by Justin D Leigh PLLC</p>
            <div className="eg-actions">
              <a className="eg-btn eg-btn-primary" href="#contact">Start a conversation</a>
              <a className="eg-btn eg-btn-ghost" href="#services">See services</a>
            </div>
          </div>
        </section>

        <section className="eg-block" id="services">
          <div className="eg-wrap">
            <p className="eg-label">Services</p>
            <h2>Where we help</h2>
            <div className="eg-grid">
              {SERVICES.map((s, i) => (
                <article className="eg-card" key={s.title}>
                  <div className="eg-num">{String(i + 1).padStart(2, "0")}</div>
                  <Icon d={s.path} />
                  <h3>{s.title}</h3>
                  <p className="eg-muted">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="eg-block eg-alt" id="approach">
          <div className="eg-wrap">
            <p className="eg-label">Approach</p>
            <h2>How an engagement works</h2>
            <ol className="eg-steps">
              <li>
                <h3>Conversation</h3>
                <p className="eg-muted">
                  A call to work out what you are actually trying to fix. Most firms arrive with
                  a product in mind. The more useful conversation is usually about the work the
                  product is supposed to do.
                </p>
              </li>
              <li>
                <h3>Plan</h3>
                <p className="eg-muted">
                  A written scope before any work starts, setting out what gets built, what it
                  costs, and what you are left holding at the end of it.
                </p>
              </li>
              <li>
                <h3>Build and train</h3>
                <p className="eg-muted">
                  Implementation, then training for the people who have to use it, then a
                  follow-up once it has been in real use long enough to show its edges.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="eg-block" id="about">
          <div className="eg-wrap eg-about">
            <img className="eg-photo" src="/headshot.webp" alt="Justin D. Leigh" width="380" height="475" />
            <div>
              <p className="eg-label">About</p>
              <h2>Justin D. Leigh</h2>
              <p style={{ marginTop: 20 }}>
                I am an independent attorney in downtown Spokane, admitted in Washington and
                Oregon. My practice is real estate and land use, estates and probate, business
                and regulatory work, and the litigation that comes out of all three.
              </p>
              <p>
                The research, drafting and review systems I use every day are ones I built, with
                the verification and supervision controls the Rules of Professional Conduct
                require, and I wrote my own firm&rsquo;s AI usage policy against WSBA Advisory
                Opinion 202505 and ABA Formal Opinion 512. I advise other firms from that, rather
                than from a vendor&rsquo;s brochure.
              </p>
              <p>
                <a href="/">Visit the Law Office of Justin D. Leigh &rarr;</a>
              </p>
            </div>
          </div>
        </section>

        <section className="eg-block eg-cta" id="contact">
          <div className="eg-wrap">
            <div className="eg-head">
              <p className="eg-label">Start a conversation</p>
              <h2>Tell me about your practice</h2>
              <p>
                Tell me what you are trying to do and I will tell you whether AI is the right
                tool for it.
              </p>
            </div>

            {status === "success" ? (
              <div className="eg-thanks">
                <h3>Thank you</h3>
                <p>I will be in touch shortly to discuss your firm&rsquo;s AI work.</p>
              </div>
            ) : (
              <form className="eg-form" onSubmit={handleSubmit}>
                <div className="eg-hp" aria-hidden="true">
                  <input type="text" name="website_url" value={honeypot} tabIndex={-1}
                         autoComplete="off" onChange={(e) => setHoneypot(e.target.value)} />
                </div>

                <div className="eg-row">
                  <div className="eg-field">
                    <label htmlFor="eg-name">Name <span className="eg-req">*</span></label>
                    <input id="eg-name" name="name" required value={form.name}
                           onChange={handleChange} placeholder="Your full name" />
                  </div>
                  <div className="eg-field">
                    <label htmlFor="eg-email">Email <span className="eg-req">*</span></label>
                    <input id="eg-email" name="email" type="email" required value={form.email}
                           onChange={handleChange} placeholder="you@example.com" />
                  </div>
                </div>

                <div className="eg-field">
                  <label htmlFor="eg-phone">Phone</label>
                  <input id="eg-phone" name="phone" type="tel" value={form.phone}
                         onChange={handleChange} placeholder="(optional)" />
                </div>

                <div className="eg-field">
                  <label htmlFor="eg-message">
                    Tell me about your practice <span className="eg-req">*</span>
                  </label>
                  <textarea id="eg-message" name="message" required rows={4} value={form.message}
                            onChange={handleChange}
                            placeholder="What AI challenges or goals does your firm have?" />
                </div>

                <p className="eg-form-note">
                  By submitting this form, you acknowledge that this inquiry does not create an
                  attorney-client relationship. Please do not include confidential or sensitive
                  information until a formal engagement has been established. Information submitted
                  through this form is not protected by attorney-client privilege. See the{" "}
                  <a href="/terms">Terms &amp; Disclaimer</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>.
                </p>

                <button type="submit" className="eg-btn eg-btn-submit" disabled={status === "sending"}>
                  {status === "sending" ? "Submitting…" : "Request a consultation"}
                </button>

                {status === "error" && (
                  <p className="eg-error" role="alert" aria-live="assertive">
                    Something went wrong. Please try again, or email justindleigh@gmail.com.
                  </p>
                )}
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="eg-footer">
        <div className="eg-wrap">
          <img src={`${LOGO}/evergreen-horizontal-offered-by-reversed.svg`}
               alt="Evergreen Legal AI, offered by Justin D Leigh PLLC" />
          <p>
            Evergreen Legal AI is a trade name of Justin D Leigh PLLC, d/b/a Law Office of
            Justin D. Leigh. 601 W. 1st Ave., Ste. 1400, PMB #17389612, Spokane, WA 99201
            &middot; <a href="tel:5094264415">(509) 426-4415</a> &middot;{" "}
            <a href="mailto:justindleigh@gmail.com">justindleigh@gmail.com</a>
          </p>
          <p>
            <a href="/">Law Office of Justin D. Leigh</a> &middot;{" "}
            <a href="/privacy">Privacy Policy</a> &middot;{" "}
            <a href="/terms">Terms &amp; Disclaimer</a> &middot;{" "}
            <a href="/accessibility">Accessibility</a>
          </p>
          {/* [ATTORNEY REVIEW REQUIRED] Drafted on the premise that Evergreen work is a
              law-related service under RPC 5.7 and is NOT the practice of law. Justin has to
              confirm that premise before this page launches; the alternative wording treats
              every engagement as legal services. Nothing else on the page turns on it. */}
          <p className="eg-disclaimer">
            Attorney advertising. Evergreen Legal AI provides consulting and advisory services on
            the use of artificial intelligence. Those services are not the practice of law and do
            not create an attorney-client relationship. An attorney-client relationship with the
            Law Office of Justin D. Leigh is formed only by a signed engagement letter. Nothing
            on this site is legal advice, and you should not send confidential information
            through it. Justin D. Leigh is admitted in Washington and Oregon.
          </p>
          <p>&copy; {new Date().getFullYear()} Justin D Leigh PLLC</p>
        </div>
      </footer>
    </div>
  );
}
