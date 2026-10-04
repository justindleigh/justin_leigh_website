import { Link } from "react-router-dom";
import posts from "../data/posts.json";

// Grouped so the index reads as a practice map rather than a reverse-chronological
// feed. A prospective client arrives looking for their problem, not for the newest post.
const GROUPS = [
  {
    label: "Real Estate & Property",
    slugs: [
      "buying-selling-property-washington",
      "reading-a-title-report-washington",
      "adverse-possession-washington",
      "easements-boundary-disputes-washington",
    ],
  },
  {
    label: "Land Use & Development",
    slugs: [
      "dividing-developing-land-washington",
      "washington-land-use-permitting-appeals",
    ],
  },
  {
    label: "Estates & Probate",
    slugs: [
      "will-or-trust-washington",
      "probate-in-washington",
      "tedra-estate-disputes-washington",
    ],
  },
  {
    label: "Business & Licensing",
    slugs: [
      "washington-llc-formation-operating-agreements",
      "washington-liquor-license-lcb",
      "alcohol-litigation-commerce-clause",
    ],
  },
  {
    label: "Civil Rights & Employment",
    slugs: [
      "civil-rights-section-1983-washington",
      "employment-discrimination-washington-wlad",
    ],
  },
  {
    label: "Family",
    slugs: ["washington-parenting-plans-fathers-rights"],
  },
  {
    label: "Technology & Practice",
    slugs: ["ai-and-your-lawyer-washington", "ai-governance-for-law-firms"],
  },
];

function Card({ post }) {
  if (!post) return null;
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass block p-6 border border-white/5 hover:border-gold/30 transition-colors group"
    >
      <h3 className="font-serif text-xl text-white mb-3 leading-snug group-hover:text-gold-light transition-colors">
        {post.title}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed mb-4">
        {post.lede.length > 180 ? post.lede.slice(0, 180).trimEnd() + "…" : post.lede}
      </p>
      <span className="text-[11px] uppercase tracking-[3px] text-gold">
        {post.minutes} min read
      </span>
    </Link>
  );
}

export default function BlogIndex() {
  const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

  // A post missing from GROUPS would otherwise never appear on the index.
  // Collect any stragglers rather than lose them silently.
  const grouped = new Set(GROUPS.flatMap((g) => g.slugs));
  const ungrouped = posts.filter((p) => !grouped.has(p.slug));
  const groups = ungrouped.length
    ? [...GROUPS, { label: "More", slugs: ungrouped.map((p) => p.slug) }]
    : GROUPS;

  return (
    <section className="min-h-screen bg-black pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-light text-white mb-4 leading-tight">
            Notes on{" "}
            <span className="text-gradient-gold font-semibold">Washington Law</span>
          </h1>
          <p className="text-white/40 text-sm mt-5">
            {posts.length} articles · general information, not legal advice
          </p>
        </div>

        {groups.map((g) => (
          <div key={g.label} className="mb-16">
            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-6 block">
              {g.label}
            </span>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {g.slugs.map((s) => (
                <Card key={s} post={bySlug[s]} />
              ))}
            </div>
          </div>
        ))}

        <div className="max-w-3xl mx-auto text-center pt-12 border-t border-white/5">
          <h2 className="font-serif text-2xl font-light text-white mb-3">
            Have a question these do not answer?
          </h2>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            These articles are general information about Washington law. They are not
            legal advice and reading them does not make you a client.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 border border-gold/40 text-gold hover:bg-gold/10 transition-colors text-sm tracking-wide"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
