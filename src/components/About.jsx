import useInView from "../hooks/useInView";

const highlights = [
  "Licensed in Washington (also admitted in Oregon)",
  "Solo Practitioner: Direct Access",
  "No-Cost Initial Consultations",
  "Former Brewery & Winery Owner",
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
                src="/headshot.png"
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
              A Dedicated Practitioner
              <br />
              <span className="text-gradient-gold font-semibold">Fighting for You</span>
            </h2>

            <div className="space-y-5 mb-10">
              <p className="text-white/80 text-[15px] leading-relaxed">
                Justin D. Leigh is a committed attorney based in downtown Spokane,
                Washington. As a solo practitioner, he provides the personalized,
                one-on-one attention that larger firms simply cannot match.
              </p>
              <p className="text-white/80 text-[15px] leading-relaxed">
                With a diverse practice spanning real estate, business law,
                estate planning, personal injury, and criminal defense, Justin
                brings unique depth to every case. When you hire Justin, you work
                directly with Justin, not a paralegal or an associate.
              </p>
              <p className="text-white/80 text-[15px] leading-relaxed">
                Justin also brings real-world business insight as a former
                brewery and winery owner, which gives him a practical edge in
                alcohol beverage law and business strategy.
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
      </div>
    </section>
  );
}
