import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer aria-label="Site footer" className="bg-black border-t border-white/5 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          {/* Firm Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 border border-gold/40 flex items-center justify-center text-gold font-serif font-bold text-xs">
                JL
              </div>
              <span className="text-sm text-white/40">
                Law Office of Justin D. Leigh
              </span>
            </div>
            <div className="text-[12px] text-white/30 space-y-1 ml-10">
              <p>Justin D. Leigh, Attorney at Law</p>
              <p>Office: Downtown Spokane, WA (by appointment only)</p>
              <p>Mailing: 601 W. 1st Ave., Ste. 1400, PMB #17389612, Spokane, WA 99201</p>
              <p>WSBA #55307</p>
              <p className="mt-2"><a href="tel:5094264415" className="text-gold/60 hover:text-gold transition-colors">(509) 426-4415</a></p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[2px] uppercase text-white/20 mb-1">Navigate</span>
              <a href="/#about" className="text-xs text-white/30 hover:text-gold/70 transition-colors">About</a>
              <Link to="/contact" className="text-xs text-white/30 hover:text-gold/70 transition-colors">Contact</Link>
              <Link to="/alcohol-beverage-law" className="text-xs text-white/30 hover:text-gold/70 transition-colors">Beverage Law</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[2px] uppercase text-white/20 mb-1">Legal</span>
              <Link to="/privacy" className="text-xs text-white/30 hover:text-gold/70 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-xs text-white/30 hover:text-gold/70 transition-colors">Terms &amp; Disclaimer</Link>
              <Link to="/accessibility" className="text-xs text-white/30 hover:text-gold/70 transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-white/20 tracking-wide leading-relaxed">
          <p>&copy; {new Date().getFullYear()} Justin D. Leigh, PLLC, d/b/a Law Office of Justin D. Leigh. All rights reserved.</p>
          <p className="mt-1">Licensed to practice law in Washington and Oregon.</p>
          <p className="mt-1">Attorney advertising. Prior results do not guarantee a similar outcome. The hiring of a lawyer is an important decision that should not be based solely upon advertisements.</p>
        </div>
      </div>
    </footer>
  );
}
