import { Link } from "react-router-dom";
import posts from "../data/posts.json";

// The articles were previously reachable only by typing the URL. This puts
// them on the homepage, which is also where they pick up internal links from
// the strongest page on the site.
//
// Hand-picked rather than "most recent": these three span the practice areas
// people most often arrive with, and the set should not reshuffle itself
// whenever something new is written.
const FEATURED = [
  "buying-selling-property-washington",
  "probate-in-washington",
  "dividing-developing-land-washington",
];

export default function ArticlesTeaser() {
  const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
  const featured = FEATURED.map((s) => bySlug[s]).filter(Boolean);
  if (!featured.length) return null;

  return (
    <section id="articles" className="bg-black py-20 sm:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-4 block">
              Writing
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-light text-white leading-tight">
              Notes on{" "}
              <span className="text-gradient-gold font-semibold">Washington Law</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="text-[11px] uppercase tracking-[3px] text-gold hover:text-gold-light transition-colors whitespace-nowrap"
          >
            All {posts.length} articles →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="glass block p-6 border border-white/5 hover:border-gold/30 transition-colors group min-w-0"
            >
              <h3 className="font-serif text-lg text-white mb-3 leading-snug group-hover:text-gold-light transition-colors">
                {p.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                {p.lede.length > 150 ? p.lede.slice(0, 150).trimEnd() + "…" : p.lede}
              </p>
              <span className="text-[11px] uppercase tracking-[3px] text-gold">
                {p.minutes} min read
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
