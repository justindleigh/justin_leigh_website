import useInView from "../hooks/useInView";

const reasons = [
  {
    num: "01",
    title: "Direct Attorney Access",
    desc: "As a solo practitioner, Justin personally handles every aspect of your case. No hand-offs, no surprises - just direct communication with your attorney.",
  },
  {
    num: "02",
    title: "Tailored Legal Strategy",
    desc: "Every case receives a custom scope of work carefully designed around your specific objectives and financial considerations.",
  },
  {
    num: "03",
    title: "Local, In-Person Counsel",
    desc: "Meet with Justin by appointment at his downtown Spokane office, or connect by phone or video if that's easier for you.",
  },
];

export default function WhyChoose() {
  const [ref, inView] = useInView();

  return (
    <section id="why" className="relative bg-black py-28 px-6">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-4 block">
            The Difference
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-white">
            Why Choose{" "}
            <span className="text-gradient-gold font-semibold">Justin D. Leigh</span>
          </h2>
          <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-px">
          {reasons.map((r, i) => (
            <div
              key={r.num}
              className={`group bg-black p-10 text-center hover:bg-white/[0.02] transition-all duration-700 border border-transparent hover:border-gold/10 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: inView ? `${0.2 + i * 0.12}s` : "0s" }}
            >
              <div className="font-serif text-5xl font-light text-gold/30 group-hover:text-gold/60 transition-colors mb-6">
                {r.num}
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-4">{r.title}</h3>
              <p className="text-sm leading-relaxed text-white/80">{r.desc}</p>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 py-6 border-t border-b border-white/5 flex flex-wrap items-center justify-center gap-8 sm:gap-14 transition-opacity duration-700 ${
            inView ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: inView ? "0.8s" : "0s" }}
        >
          {[
            "Licensed in Washington State",
            "Downtown Spokane Office",
            "Serving Spokane, the Inland Northwest & Beyond",
          ].map((item) => (
            <div key={item} className="flex items-center justify-center gap-3 text-[13px] font-medium tracking-wide uppercase text-white/80 w-full sm:w-auto text-center">
              <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
