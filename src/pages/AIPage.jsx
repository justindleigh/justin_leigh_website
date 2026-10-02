import { useState } from "react";
import { supabase } from "../lib/supabase";

const services = [
  {
    title: "Integration",
    desc: "Seamless integration of AI tools into your existing legal workflows and case management systems.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  },
  {
    title: "Tools Strategy",
    desc: "Custom AI tool selection and deployment strategy tailored to your practice area and firm size.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
  },
  {
    title: "Training",
    desc: "Comprehensive training programs for attorneys and staff to maximize AI adoption and productivity.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
  },
  {
    title: "Compliance",
    desc: "Ensure AI usage meets bar association ethics rules, client confidentiality requirements, and regulatory standards.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    title: "Auditing",
    desc: "Regular auditing of AI outputs, workflows, and data handling to maintain quality and accuracy.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /><path d="M9 14l2 2 4-4" /></svg>,
  },
  {
    title: "Risk Management",
    desc: "Proactive identification and mitigation of AI-related risks including bias, hallucination, and data exposure.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" /></svg>,
  },
];

export default function AIPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [honeypot, setHoneypot] = useState("");
  const [formLoadTime] = useState(Date.now());

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Bot detection
    if (honeypot) { setStatus("success"); return; }
    if (Date.now() - formLoadTime < 3000) { setStatus("success"); return; }

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
    <section className="min-h-screen bg-black pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-strong mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-medium text-white/60 tracking-wide">NOW OFFERING AI CONSULTATION</span>
          </div>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-light text-white mb-4 leading-tight">
            Integrate{" "}
            <span className="text-gradient-gold font-semibold">A.I.</span> Into
            <br />
            Your Legal Practice
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-2">
            The firm runs a dedicated consulting practice for artificial intelligence, advising
            law firms and businesses on governance, compliant workflows, and the questions that
            come with adopting these tools.
            Transform your firm with intelligent automation, compliant AI workflows, and measurable ROI.
          </p>
          <p className="text-white/40 text-sm">
            Email Justin at{" "}
            <a href="mailto:justindleigh@gmail.com" className="text-gold hover:text-gold-light transition-colors">justindleigh@gmail.com</a>{" "}
            to discuss your firm's AI strategy.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px mb-20">
          {services.map((s) => (
            <div key={s.title} className="bg-black p-8 hover:bg-white/[0.03] transition-all duration-500 group relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-14 h-14 bg-gold/10 text-gold flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                {s.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/50 group-hover:text-white/70 transition-colors">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-4 block">
              Learn More
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-light text-white mb-3">
              Ready to Modernize{" "}
              <span className="text-gradient-gold font-semibold">Your Practice?</span>
            </h2>
            <p className="text-white/50 text-sm">
              Fill out the form below or email{" "}
              <a href="mailto:justindleigh@gmail.com" className="text-gold hover:text-gold-light transition-colors">justindleigh@gmail.com</a>
            </p>
          </div>

          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gold/20 flex items-center justify-center mx-auto mb-5">
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><path d="M5 13l4 4L19 7" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Thank You</h3>
              <p className="text-white/50">We'll be in touch shortly to discuss your AI consultation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                <input type="text" name="website_url" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-medium text-white/50 mb-2">Name <span className="text-gold">*</span></label>
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="Your full name"
                    className="w-full bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-white/50 mb-2">Email <span className="text-gold">*</span></label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com"
                    className="w-full bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-white/50 mb-2">Phone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(optional)"
                  className="w-full bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-white/50 mb-2">Tell us about your practice <span className="text-gold">*</span></label>
                <textarea name="message" required value={form.message} onChange={handleChange} rows={4} placeholder="What AI challenges or goals does your firm have?"
                  className="w-full bg-white/[0.04] border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors resize-y min-h-[100px]" />
              </div>
              <div className="bg-white/[0.03] border border-white/10 p-4 text-[11px] text-white/40 leading-relaxed">
                <p>By submitting this form, you acknowledge that this inquiry does not create an attorney-client relationship. Please do not include confidential or sensitive information until a formal engagement has been established. Information submitted through this form is not protected by attorney-client privilege. See our <a href="/terms" className="text-gold/60 hover:text-gold underline">Terms &amp; Disclaimer</a> and <a href="/privacy" className="text-gold/60 hover:text-gold underline">Privacy Policy</a>.</p>
              </div>
              <button type="submit" disabled={status === "sending"}
                className="w-full sm:w-auto px-10 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50">
                {status === "sending" ? "Submitting..." : "Request Consultation"}
              </button>
              {status === "error" && <p role="alert" aria-live="assertive" className="text-red-400 text-sm">Something went wrong. Please try again or call directly.</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
