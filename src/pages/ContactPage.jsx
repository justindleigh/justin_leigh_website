import { useState } from "react";
import { supabase } from "../lib/supabase";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  preferred_datetime: "",
  opposing_party: "",
  how_heard: "",
  real_estate_inquiry: "",
  court_case: "",
  other_attorney: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formLoadTime] = useState(Date.now());

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Bot detection: honeypot field filled or submitted too fast
    if (honeypot) { setStatus("success"); return; }
    if (Date.now() - formLoadTime < 3000) { setStatus("success"); return; }

    setStatus("sending");
    setErrorMsg("");

    try {
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert([{
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          subject: form.subject,
          message: form.message,
          preferred_datetime: form.preferred_datetime || null,
          opposing_party: form.opposing_party || null,
          how_heard: form.how_heard || null,
          real_estate_inquiry: form.real_estate_inquiry || null,
          court_case: form.court_case || null,
          other_attorney: form.other_attorney || null,
        }]);

      if (dbError) throw dbError;

      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } catch {
        console.warn("Email notification failed, but form was saved.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-6 py-28">
        <div className="max-w-xl text-center">
          <div className="w-16 h-16 bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
              <path d="M5 13l4 4L19 7" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-light text-white mb-4">Thank You</h1>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            Your inquiry has been received. Justin typically responds within two
            business days. If your matter is urgent, please call directly.
          </p>
          <a href="/" className="inline-block px-8 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors">
            Return Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-4">
            Schedule a{" "}
            <span className="text-gradient-gold font-semibold">Consultation</span>
          </h1>
          <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed">
            I offer complimentary initial consultations to discuss your legal matters
            and develop a plan tailored to your goals. I typically respond within two business days.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14">
          {/* LEFT: Form */}
          <div>
            <div className="text-[11px] font-semibold tracking-[3px] uppercase text-gold mb-6">
              Consultation Request
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot — hidden from humans, bots auto-fill it */}
              <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                <input type="text" name="website_url" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Name" name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" />
                <FormField label="Email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(optional)" />
                <FormField label="Subject" name="subject" required value={form.subject} onChange={handleChange} placeholder="Brief description of your inquiry" />
              </div>
              <FormField label="Preferred Day/Time for Consultation" name="preferred_datetime" value={form.preferred_datetime} onChange={handleChange} placeholder="e.g. Weekday mornings, Tuesday after 2pm, etc." />
              <FormField label="How can I help you?" name="message" textarea required value={form.message} onChange={handleChange} placeholder="Please describe your legal matter..." />
              <FormField label="Name of Opposing Party/Parties" name="opposing_party" textarea value={form.opposing_party} onChange={handleChange} placeholder="For conflict review purposes (optional)" />
              <FormField label="How did you hear about me?" name="how_heard" value={form.how_heard} onChange={handleChange} placeholder="(optional)" />
              <FormField label="Is your inquiry pertaining to real estate?" name="real_estate_inquiry" value={form.real_estate_inquiry} onChange={handleChange} placeholder="If yes, please include address or parcel number (optional)" />
              <FormField label="Is your matter related to an existing court case?" name="court_case" value={form.court_case} onChange={handleChange} placeholder="If yes, please provide case details (optional)" />
              <FormField label="Is there another attorney involved?" name="other_attorney" value={form.other_attorney} onChange={handleChange} placeholder="If yes, please provide their name (optional)" />

              {status === "error" && (
                <div role="alert" aria-live="assertive" className="bg-red-500/10 border border-red-500/20 px-5 py-4 text-red-400 text-sm">{errorMsg}</div>
              )}

              <p className="text-white/20 text-xs leading-relaxed">
                Please do not submit any confidential or sensitive information
                through this form. Submitting this form does not create an
                attorney-client relationship.
              </p>

              <button type="submit" disabled={status === "sending"}
                className="w-full sm:w-auto px-10 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {status === "sending" ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          </div>

          {/* RIGHT: Office Info */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Office Address */}
            <div className="border border-white/10 p-6">
              <div className="text-[11px] font-semibold tracking-[3px] uppercase text-gold mb-3">Office</div>
              <div className="font-serif text-lg text-white/80 leading-snug">
                Downtown Spokane, WA
                <br />
                By appointment only
              </div>
            </div>

            {/* Office Address */}
            <div className="border border-white/10 p-6">
              <div className="text-[11px] font-semibold tracking-[3px] uppercase text-gold mb-3">Office</div>
              <div className="font-serif text-lg text-white/80 leading-snug mb-3">
                601 W. 1st Ave., Ste. 1400
                <br />
                Spokane, WA 99201
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("601 W. 1st Ave., Ste. 1400, Spokane, WA 99201");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gold/70 hover:text-gold border border-gold/20 hover:border-gold/40 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  {copied ? <path d="M5 13l4 4L19 7" /> : <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></>}
                </svg>
                {copied ? "Copied!" : "Copy Address"}
              </button>
            </div>

            {/* Hours & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 p-5">
                <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/25 mb-2">Hours</div>
                <div className="font-serif text-sm text-white/70">By Appointment Only</div>
              </div>
              <div className="border border-white/10 p-5">
                <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/25 mb-2">Phone</div>
                <a href="tel:5094264415" className="font-serif text-sm text-gold hover:text-gold-light transition-colors">(509) 426-4415</a>
              </div>
            </div>

            {/* Google Map */}
            <div className="relative overflow-hidden border border-white/10">
              <iframe
                title="Office Location"
                src="https://maps.google.com/maps?q=601+W+1st+Ave,+Spokane,+WA+99201&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="220"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.3) brightness(0.8)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, name, type = "text", required, textarea, value, onChange, placeholder }) {
  const baseClass =
    "w-full bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors";
  return (
    <div>
      <label htmlFor={name} className="block text-[13px] font-medium text-white/50 mb-2">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea id={name} name={name} required={required} value={value} onChange={onChange} placeholder={placeholder} rows={4} className={baseClass + " resize-y min-h-[100px]"} />
      ) : (
        <input id={name} name={name} type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} className={baseClass} />
      )}
    </div>
  );
}
