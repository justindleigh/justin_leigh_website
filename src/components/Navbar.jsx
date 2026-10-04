import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "Practice Areas", href: "/#practice", section: "practice" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Why Justin", href: "/#why", section: "why" },
  { label: "Beverage Law", href: "/alcohol-beverage-law" },
  { label: "Articles", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function ThemeToggle({ className = "" }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className={`relative w-12 h-6 rounded-full bg-white/10 border border-white/10 flex items-center transition-colors duration-300 hover:bg-white/15 ${className}`}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] ${
          dark
            ? "left-0.5 bg-navy text-gold"
            : "left-[calc(100%-22px)] bg-gold text-navy"
        }`}
      >
        {dark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("practice");
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (location.pathname !== "/") return;
      const sections = ["practice", "about", "why", "contact"];
      let current = "practice";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-nav-down ${
        scrolled
          ? "bg-black/90 backdrop-blur-3xl backdrop-saturate-150 shadow-lg shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
          <div className="w-8 h-8 border border-gold/60 flex items-center justify-center text-gold font-serif font-bold text-sm group-hover:bg-gold/10 transition-colors">
            JL
          </div>
          <span className="font-medium tracking-tight text-white text-sm hidden sm:block">
            Justin D. Leigh
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === location.pathname
                ? true
                : location.pathname === "/"
                ? link.section === activeSection
                : false;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors whitespace-nowrap ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden xl:flex items-center gap-5">
          <Link
            to="/ai"
            className="relative px-4 py-2 text-[12px] font-semibold tracking-wide border border-gold/60 text-gold hover:bg-gold hover:text-navy transition-all duration-300 whitespace-nowrap"
          >
            {location.pathname === "/ai" && (
              <span className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            )}
            Integrate A.I. Into Your Practice
          </Link>
          <a
            href="tel:5094264415"
            className="text-[13px] text-gold hover:text-gold-light transition-colors whitespace-nowrap"
          >
            (509) 426-4415
          </a>
          <Link
            to="/contact"
            className="relative px-5 py-2.5 text-[12px] font-semibold text-navy bg-gold hover:bg-gold-light transition-all duration-300 tracking-wide whitespace-nowrap"
          >
            Free Consultation
          </Link>
          <ThemeToggle className="ml-3" />
        </div>

        {/* Mobile: Theme toggle + Hamburger */}
        <div className="xl:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex items-center justify-center relative"
            aria-label="Menu"
          >
            <span className={`absolute w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 top-[19px]" : "top-[13px]"}`} />
            <span className={`absolute w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : "top-[19px]"}`} />
            <span className={`absolute w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 top-[19px]" : "top-[25px]"}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden bg-black/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/60 hover:text-white transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-white/5 my-1" />
            <Link
              to="/ai"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-gold hover:text-gold-light transition-colors py-1"
            >
              Integrate A.I. Into Your Practice
            </Link>
            <a
              href="tel:5094264415"
              className="text-sm text-gold hover:text-gold-light transition-colors py-1"
            >
              (509) 426-4415
            </a>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-5 py-3 text-sm font-semibold text-navy bg-gold hover:bg-gold-light text-center transition-colors"
            >
              Free Consultation
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-80px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-nav-down {
          animation: navSlideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </nav>
  );
}
