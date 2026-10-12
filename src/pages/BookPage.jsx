import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

/**
 * Book a consultation.
 *
 * Two paths, deliberately unequal. A phone call is quick to ask for and quick
 * to give. A meeting at the office costs an hour of the day and a trip for
 * both people, so it asks for more: what the matter is, whether a call has
 * already happened, and three times that work rather than one.
 *
 * That is the firm's actual preference, which is a call first, expressed as
 * the shape of the form instead of a sentence asking people to please call
 * first.
 *
 * SCHEDULING
 *
 * When `GOOGLE_BOOKING_URL` is set, the call path hands off to Google's
 * appointment schedule, which reads the real calendar, so a slot offered is a
 * slot that is free. Until then both paths collect preferred times and the
 * office confirms by email. The page never claims a booking is confirmed when
 * what happened was a request.
 */

// Times the office has published. Built from availability Justin writes down,
// with anything already on the watched calendars removed. An empty or missing
// file is not an error: the page falls back to asking when they are free.
const SLOTS_URL =
  "https://gpckxhsiawummkkegeix.supabase.co/storage/v1/object/public/public-booking/slots.json";

const OFFICE = "601 W. 1st Ave., Suite 1400, Spokane";

const MATTERS = [
  "Real estate or land use",
  "Estate planning or probate",
  "Civil litigation",
  "Employment",
  "Family law",
  "Landlord and tenant",
  "Business or regulatory",
  "Civil rights",
  "Alcohol and beverage licensing",
  "Something else",
];

const emptyForm = {
  name: "", email: "", phone: "", matter: "", summary: "",
  first: "", second: "", third: "", had_call: "", how_heard: "",
};

export default function BookPage() {
  // A link sent by the office can carry who it was sent to, so the person is
  // not retyping what the firm already knows. Everything stays editable: the
  // link is a convenience, not an assertion about who is holding the phone.
  const prefill = (() => {
    if (typeof window === "undefined") return {};
    const q = new URLSearchParams(window.location.search);
    const take = (k) => (q.get(k) || "").slice(0, 120);
    return {
      name: take("name"), email: take("email"), phone: take("phone"),
      matter: take("matter"), ref: take("ref"), mode: take("mode"),
    };
  })();

  const [mode, setMode] = useState(prefill.mode === "office" ? "office" : "call");
  const [slots, setSlots] = useState(null);
  const [picked, setPicked] = useState("");

  useEffect(() => {
    let live = true;
    fetch(SLOTS_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live) setSlots(d && d.count ? d : null); })
      .catch(() => { if (live) setSlots(null); });
    return () => { live = false; };
  }, []);
  const [form, setForm] = useState({
    ...emptyForm,
    name: prefill.name || "",
    email: prefill.email || "",
    phone: prefill.phone || "",
    matter: MATTERS.includes(prefill.matter) ? prefill.matter : "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loadedAt] = useState(Date.now());

  const inPerson = mode === "office";
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    // Same two guards the contact form uses: a field no person can see, and a
    // submission too fast for anyone to have typed.
    if (honeypot) { setStatus("done"); return; }
    if (Date.now() - loadedAt < 3000) { setStatus("done"); return; }

    setStatus("sending");
    setErrorMsg("");

    const chosen = slots && picked
      ? slots.days.flatMap((d) => d.slots).find((x) => x.start === picked)
      : null;
    const times = chosen
      ? [`${new Date(chosen.start).toLocaleString(undefined, {
          weekday: "long", month: "long", day: "numeric",
        })} at ${chosen.label}`]
      : [form.first, form.second, form.third].filter(Boolean);
    const lines = [
      inPerson
        ? `Asking for a meeting at the ${OFFICE} office.`
        : "Asking for an initial phone call.",
      "",
      form.matter ? `Area: ${form.matter}` : "",
      "",
      form.summary,
      "",
      times.length ? "Times that work:" : "",
      ...times.map((t, i) => `  ${i + 1}. ${t}`),
      inPerson && form.had_call ? `\nAlready spoken with the office: ${form.had_call}` : "",
    ].filter((l) => l !== undefined);

    try {
      const { error } = await supabase.from("contact_submissions").insert([{
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: inPerson ? "In-person meeting request" : "Phone consultation request",
        message: lines.join("\n").trim(),
        preferred_datetime: picked || form.first || null,
        how_heard: form.how_heard || (prefill.ref ? `Booking link (${prefill.ref})` : null),
      }]);
      if (error) throw error;

      // Best effort. The request is already saved; the email is a convenience
      // for the office, so a failure here is not the visitor's problem.
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        await fetch(`${url}/functions/v1/send-contact-email`, {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name, email: form.email, phone: form.phone,
            subject: inPerson ? "In-person meeting request" : "Phone consultation request",
            message: lines.join("\n").trim(),
            preferred_datetime: picked || form.first,
          }),
        });
      } catch {
        // Saved regardless.
      }

      setStatus("done");
      setForm(emptyForm);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again, or call the office.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-6 py-28">
        <div className="max-w-xl text-center">
          <div className="w-16 h-16 bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="#d4b65c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-light text-white mb-4">Request received</h1>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            The office will confirm a time by email, usually the same day.
            Nothing is on the calendar until you hear back.
          </p>
          <a href="/" className="inline-block px-8 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors">
            Back to the site
          </a>
        </div>
      </section>
    );
  }

  const field =
    "w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white text-[15px] " +
    "placeholder:text-white/25 focus:outline-none focus:border-gold/60 transition-colors";
  const label = "block text-[11px] font-semibold tracking-[2px] uppercase text-gold mb-2";

  return (
    <section className="min-h-screen bg-black py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-4">
            Book a <span className="text-gradient-gold font-semibold">Consultation</span>
          </h1>
          {prefill.name && (
            <p className="text-gold text-[13px] tracking-wide mb-3">
              Prepared for {prefill.name}
            </p>
          )}
          <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed">
            Most matters start with a short phone call. It costs you fifteen
            minutes and usually answers whether this office is the right one
            for the problem.
          </p>
        </div>

        {/* Two paths */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <button
            type="button"
            onClick={() => {
              if (GOOGLE_BOOKING_URL) window.location.href = GOOGLE_BOOKING_URL;
              else setMode("call");
            }}
            className={`text-left border p-6 transition-colors ${
              mode === "call" ? "border-gold bg-gold/[0.06]" : "border-white/10 hover:border-gold/40"
            }`}
          >
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-gold mb-2">
              Start here
            </div>
            <div className="font-serif text-2xl font-light text-white mb-1.5">A phone call</div>
            <p className="text-white/50 text-[13.5px] leading-relaxed">
              Fifteen to twenty minutes. Tell me what happened and I will tell
              you whether there is something here.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode("office")}
            className={`text-left border p-6 transition-colors ${
              mode === "office" ? "border-gold bg-gold/[0.06]" : "border-white/10 hover:border-gold/40"
            }`}
          >
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-white/40 mb-2">
              After a call
            </div>
            <div className="font-serif text-2xl font-light text-white mb-1.5">
              Meet at the office
            </div>
            <p className="text-white/50 text-[13.5px] leading-relaxed">
              {OFFICE}. Ask for this when there are documents to go through or
              the matter is already underway.
            </p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
            <input
              name="website" tabIndex={-1} autoComplete="off"
              value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={label} htmlFor="b-name">Your name</label>
              <input id="b-name" name="name" required value={form.name} onChange={change} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="b-email">Email</label>
              <input id="b-email" name="email" type="email" required value={form.email} onChange={change} className={field} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={label} htmlFor="b-phone">Phone</label>
              <input id="b-phone" name="phone" required value={form.phone} onChange={change} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="b-matter">What it concerns</label>
              <select id="b-matter" name="matter" value={form.matter} onChange={change} className={field}>
                <option value="">Choose...</option>
                {MATTERS.map((m) => <option key={m} value={m} className="bg-navy">{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={label} htmlFor="b-summary">
              {inPerson ? "What you want to go through" : "What happened"}
            </label>
            <textarea
              id="b-summary" name="summary" required rows={inPerson ? 5 : 4}
              value={form.summary} onChange={change} className={field}
              placeholder={
                inPerson
                  ? "What the meeting is for, and what you will bring."
                  : "A few sentences is plenty. Dates and names help."
              }
            />
          </div>

          {!inPerson && slots && (
            <div>
              <label className={label}>Pick a time</label>
              <div className="space-y-4">
                {slots.days.slice(0, 8).map((d) => (
                  <div key={d.date}>
                    <div className="text-white/40 text-[12px] tracking-wide mb-2">
                      {new Date(d.date + "T12:00:00").toLocaleDateString(undefined, {
                        weekday: "long", month: "long", day: "numeric",
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {d.slots.map((x) => (
                        <button
                          key={x.start}
                          type="button"
                          onClick={() => setPicked(x.start)}
                          className={`px-4 py-2.5 text-[13px] border transition-colors ${
                            picked === x.start
                              ? "border-gold bg-gold text-navy font-semibold"
                              : "border-white/15 text-white/80 hover:border-gold/60"
                          }`}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-xs mt-3 leading-relaxed">
                {slots.blackouts_checked
                  ? "Pacific time. You will get a confirmation by email."
                  : "Pacific time. The office confirms every time by email before it is final."}
              </p>
            </div>
          )}

          <div className={!inPerson && slots ? "hidden" : ""}>
            <label className={label}>
              {inPerson ? "Three times that work" : "When to reach you"}
            </label>
            <div className="space-y-3">
              <input
                name="first" required={inPerson || !slots} value={form.first} onChange={change} className={field}
                placeholder={inPerson ? "First choice, e.g. Tuesday 14 Oct, afternoon" : "e.g. weekday mornings, or Thursday after 2"}
              />
              {inPerson && (
                <>
                  <input name="second" required value={form.second} onChange={change} className={field} placeholder="Second choice" />
                  <input name="third" value={form.third} onChange={change} className={field} placeholder="Third choice, optional" />
                </>
              )}
            </div>
            {inPerson && (
              <p className="text-white/30 text-xs mt-3 leading-relaxed">
                Three options because court sets its dates before this office
                does, and a single choice usually has to be renegotiated.
              </p>
            )}
          </div>

          {inPerson && (
            <div>
              <label className={label} htmlFor="b-had-call">
                Have you already spoken with the office?
              </label>
              <select id="b-had-call" name="had_call" value={form.had_call} onChange={change} className={field}>
                <option value="">Choose...</option>
                <option value="Yes, we have spoken" className="bg-navy">Yes, we have spoken</option>
                <option value="No, not yet" className="bg-navy">No, not yet</option>
                <option value="I am an existing client" className="bg-navy">I am an existing client</option>
              </select>
              <p className="text-white/30 text-xs mt-2 leading-relaxed">
                If not, a short call usually comes first. It is quicker for you
                and it decides whether a meeting is worth either of our time.
              </p>
            </div>
          )}

          <div>
            <label className={label} htmlFor="b-heard">How you found the firm</label>
            <input id="b-heard" name="how_heard" value={form.how_heard} onChange={change} className={field} />
          </div>

          {errorMsg && (
            <div role="alert" aria-live="assertive" className="bg-red-500/10 border border-red-500/20 px-5 py-4 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <p className="text-white/20 text-xs leading-relaxed">
            Sending this does not make the firm your lawyer and does not create
            an attorney-client relationship. Do not send anything confidential
            until this office has agreed in writing to represent you.
          </p>

          <button
            type="submit"
            disabled={status === "sending" || (!inPerson && slots && !picked)}
            className="w-full sm:w-auto px-10 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending"
              ? "Sending..."
              : inPerson
                ? "Request the meeting"
                : slots
                  ? picked ? "Book this time" : "Pick a time above"
                  : "Request a call"}
          </button>
        </form>
      </div>
    </section>
  );
}
