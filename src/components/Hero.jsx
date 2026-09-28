import { Link } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

const badges = [
  { label: "Spokane, WA", icon: "WA" },
  {
    label: "Downtown Office",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true">
        <path d="M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M15 9h4a1 1 0 011 1v11M3 21h18M8 8h3M8 12h3M8 16h3" />
      </svg>
    ),
  },
  { label: "Free Consultations", icon: "✓" },
];

const logoPlaceholders = [
  "Real Estate",
  "Business Law",
  "Estate Planning",
  "Personal Injury",
  "Criminal Defense",
  "Trademark",
  "Civil Litigation",
  "Beverage Law",
  "Landlord-Tenant",
  "Family Law",
];

export default function Hero() {
  return (
    <section className="hero-section relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* Video Background */}
      <VideoPlayer />

      {/* Gradient overlays */}
      <div className="hero-overlay-top absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/70 z-[1]" />
      <div className="hero-overlay-bottom absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-[1]" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-16 max-w-5xl mx-auto">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-10">
          {badges.map((badge, i) => (
            <div
              key={badge.label}
              className="glass-strong flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-none animate-fade-up"
              style={{ animationDelay: `${0.3 + i * 0.12}s` }}
            >
              <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gold/20 text-gold text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                {badge.icon}
              </span>
              <span className="text-[11px] sm:text-[13px] text-white/70 font-medium">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-[clamp(2rem,8vw,5rem)] font-light leading-[1.05] tracking-tight text-white mb-4 sm:mb-6 animate-fade-up"
          style={{ animationDelay: "0.65s" }}
        >
          Where{" "}
          <span className="text-gradient-gold font-semibold">Dedication</span>
          <br />
          Meets Advocacy
        </h1>

        {/* Subtitle */}
        <p
          className="text-white text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mb-8 sm:mb-10 px-2 animate-fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          Personalized legal representation for clients in Spokane, the Inland Northwest, and throughout Washington State.{" "}
          <br className="hidden sm:block" />
          <span className="text-gradient-gold font-semibold">Tailored strategy</span>, <span className="text-gradient-gold font-semibold">compassionate counsel</span>, and <span className="text-gradient-gold font-semibold">diligent advocacy</span> for
          every client.
        </p>

        {/* Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto animate-fade-up"
          style={{ animationDelay: "0.95s" }}
        >
          <Link
            to="/contact"
            className="group relative w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-black border border-white/20 text-white text-sm font-semibold tracking-wide hover:border-gold/60 transition-all duration-300 text-center"
          >
            <span className="relative z-10">Schedule Consultation</span>
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>

      {/* Lower Third Overlay - static on mobile, absolute on desktop */}
      <div className="relative z-20 px-4 pb-6 sm:pb-0 sm:px-0 sm:absolute sm:bottom-40 sm:left-12">
        <div
          className="flex animate-slide-in-left mx-auto sm:mx-0 w-fit"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="w-1 sm:w-1.5 bg-gold" />
          <div className="hero-lower-third-bg bg-black/80 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 border-y border-r border-white/5">
            <div className="font-serif text-lg sm:text-2xl font-semibold text-white leading-tight">
              Justin D. Leigh
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold tracking-[2px] sm:tracking-[3px] uppercase text-gold mt-0.5 sm:mt-1">
              Attorney-at-Law
            </div>
          </div>
          <div className="bg-gold px-3 sm:px-4 flex items-center justify-center">
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-navy leading-tight text-center">
              Spokane,
              <br />
              WA
            </span>
          </div>
        </div>
      </div>

      {/* Practice Area Marquee */}
      <div className="hero-marquee-bg relative z-10 border-t border-white/5 bg-black">
        <div className="mask-fade-edges py-4 sm:py-5 overflow-hidden">
          <div className="flex items-center gap-8 sm:gap-12 animate-marquee whitespace-nowrap">
            {[...logoPlaceholders, ...logoPlaceholders].map((name, i) => (
              <span
                key={i}
                className="text-[11px] sm:text-[13px] font-medium tracking-widest uppercase text-white flex-shrink-0"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes navSlideDown {
          from {
            opacity: 0;
            transform: translateY(-80px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-in-left {
          opacity: 0;
          animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-nav-down {
          opacity: 0;
          animation: navSlideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
