import { Link } from "react-router-dom";
import useInView from "../hooks/useInView";

export default function Contact() {
  const [ref, inView] = useInView();

  return (
    <section
      id="contact"
      className="contact-section relative py-28 px-6 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 40%, var(--section-bg, #000) 100%)",
      }}
    >

      <div ref={ref} className="max-w-4xl mx-auto text-center relative">
        <div
          className={`transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-4 block">
            Get Started Today
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-4">
            Ready to Discuss{" "}
            <span className="text-gradient-gold font-semibold">Your Case?</span>
          </h2>
          <p className="text-white/35 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Schedule your free initial consultation and discover how personalized
            legal representation can make all the difference.
          </p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-4 mb-14 transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: inView ? "0.3s" : "0s" }}
        >
          <Link
            to="/contact"
            className="px-8 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors"
          >
            Book Online
          </Link>
        </div>

        <div
          className={`grid sm:grid-cols-3 gap-8 sm:gap-4 transition-opacity duration-700 ${
            inView ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: inView ? "0.6s" : "0s" }}
        >
          {[
            { label: "Office", value: "Downtown Spokane, WA\nBy appointment only" },
            { label: "Mailing", value: "601 W. 1st Ave., Ste. 1400\nPMB #17389612\nSpokane, WA 99201" },
            { label: "Phone", value: "(509) 426-4415", href: "tel:5094264415" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/25 mb-2">{item.label}</div>
              {item.href ? (
                <a href={item.href} className="font-serif text-lg text-white/70 hover:text-gold transition-colors leading-snug">{item.value}</a>
              ) : (
                <div className="font-serif text-lg text-white/70 whitespace-pre-line leading-snug">{item.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
