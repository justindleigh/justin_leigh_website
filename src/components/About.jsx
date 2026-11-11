import useInView from "../hooks/useInView";

const highlights = [
  "Admitted in Washington and Oregon",
  "Direct access, no associates",
  "Free initial consultation",
  "Former brewery and winery owner",
];

const credentials = [
  {
    label: "Bar Admissions",
    items: [
      "Washington",
      "Oregon",
      "U.S. District Court, Eastern District of Washington",
      "U.S. District Court, Western District of Washington",
      "U.S. Court of Appeals for the Ninth Circuit",
      "Supreme Court of the United States",
    ],
  },
  {
    label: "Professional Memberships",
    items: [
      "Washington State Bar Association",
      "Oregon State Bar",
      "Spokane County Bar Association",
      "Washington State Association for Justice, EAGLE member",
      "Inland Empire Legal Aid",
      "Washington Brewers Guild, Allied Member",
    ],
  },
];

export default function About() {
  const [ref, inView] = useInView();

  return (
    <section id="about" className="relative bg-black py-28 px-6 overflow-hidden">

      <div ref={ref} className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div
            className={`relative transition-all duration-[900ms] ease-out ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative pb-6 pr-6">
              <img
                src="/headshot.webp"
                alt="Justin D. Leigh, Attorney-at-Law"
                className="w-full h-auto object-contain grayscale-[20%] relative z-[1]"
              />
              <div className="absolute top-4 left-4 right-0 bottom-0 border border-gold/20" />
              <div className="absolute bottom-0 right-0 bg-black border border-gold/30 px-6 py-5 z-10">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-gold leading-none uppercase">Spokane, WA</div>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-[900ms] ease-out ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: inView ? "0.15s" : "0s" }}
          >
            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-5 block">
              Meet Your Attorney
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-light text-white leading-tight mb-8">
              One Lawyer,
              <br />
              <span className="text-gradient-gold font-semibold">Start to Finish</span>
            </h2>

            <div className="space-y-5 mb-10">
              <p className="text-white/80 text-[15px] leading-relaxed">
                Justin D. Leigh practices in downtown Spokane and is admitted in both
                Washington and Oregon. He runs the firm alone, so the person who takes
                your call is the person who handles your matter.
              </p>
              <p className="text-white/80 text-[15px] leading-relaxed">
                He handles real estate, business law, estate planning, personal injury,
                and criminal defense. When you hire Justin, you work directly with
                Justin, not a paralegal or an associate.
              </p>
              <p className="text-white/80 text-[15px] leading-relaxed">
                Justin also builds and runs the AI systems inside his own practice.
                They carry the work a larger office would hand to staff: a sweep
                every morning that tracks deadlines on every open matter, and a
                check that every case citation in a filing matches the source it
                came from. No AI system advises you or decides anything in your
                matter. Justin reviews what they produce, and the legal judgment
                is his.
              </p>
              <p className="text-white/80 text-[15px] leading-relaxed">
                Justin is also a former brewery and winery owner. Alcohol beverage
                licensing is a substantial part of the practice, and he has held those
                licenses himself rather than only read about them.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-3 transition-all duration-500 ease-out ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                  style={{ transitionDelay: inView ? `${0.5 + i * 0.1}s` : "0s" }}
                >
                  <div className="w-6 h-6 bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                      <path d="M5 13l4 4L19 7" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-white/60 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`mt-20 border-t border-gold/20 pt-14 grid md:grid-cols-2 gap-12 md:gap-16 transition-all duration-[900ms] ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: inView ? "0.6s" : "0s" }}
        >
          {credentials.map((group) => (
            <div key={group.label}>
              <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-6 block">
                {group.label}
              </span>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-white/80 leading-snug">
                    <span className="mt-[9px] w-1.5 h-1.5 bg-gold/70 flex-shrink-0" />
                    <span style={{ textWrap: "pretty" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
