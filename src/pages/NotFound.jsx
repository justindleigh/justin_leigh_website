import { Link } from "react-router-dom";

/**
 * Catch-all for any URL the router does not recognize.
 *
 * Before this existed an unmatched path served the app shell with nothing in
 * it, which on this site's black body rendered as a blank black screen: no
 * message, no way back, and HTTP 200 so crawlers treated it as a real page.
 * A mistyped link or a stale one from an old email landed a client there.
 *
 * The phone number is here deliberately. Someone who reached a dead link was
 * trying to get somewhere, and on a firm site the useful recovery is usually a
 * call rather than a sitemap.
 */
export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center px-6 py-24">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6">
          Page not found
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
          That page does not exist
        </h1>
        <p className="text-white/70 leading-relaxed mb-3">
          The link may be out of date, or there may be a typo in the address.
          Nothing is wrong on your end.
        </p>
        <p className="text-white/70 leading-relaxed mb-10">
          If you were sent here to review or sign something, call the office and
          we will send you a current link.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="px-7 py-3 border border-gold/40 text-gold text-[11px] tracking-[0.18em] uppercase hover:border-gold transition-colors"
          >
            Return home
          </Link>
          <a
            href="tel:5094264415"
            className="px-7 py-3 bg-gold/90 text-navy text-[11px] tracking-[0.18em] uppercase hover:bg-gold transition-colors"
          >
            (509) 426-4415
          </a>
        </div>

        <p className="mt-12 text-white/40 text-sm">
          Law Office of Justin D. Leigh &middot; 601 W. 1st Ave., Ste. 1400,
          Spokane, WA 99201
        </p>
      </div>
    </section>
  );
}
