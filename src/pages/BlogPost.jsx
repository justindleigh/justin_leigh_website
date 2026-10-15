import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import posts from "../data/posts.json";
import { FIGURES, Figure } from "../components/Figures";

function figuresAfter(slug, index) {
  return (FIGURES[slug] || []).filter((f) => f.after === index);
}

// The invitation to get in touch, dropped into the middle of the article and
// repeated at the end. Mid-article because most readers never reach the
// bottom of a two thousand word page, and the moment someone recognizes their
// own problem in a section is the moment they are willing to ask about it.
//
// The link carries the article slug and practice area so the contact form can
// say what the enquiry is about without the reader typing it, and so Justin
// can tell which article produced the lead. Neither value is personal data.
function AskLink({ post, variant }) {
  const to = `/contact?from=${encodeURIComponent(post.slug)}` +
    (post.practiceArea ? `&area=${encodeURIComponent(post.practiceArea)}` : "");

  if (variant === "inline") {
    return (
      <div className="my-14 glass border border-gold/20 p-6 sm:p-7">
        <p className="text-white/80 text-base leading-relaxed mb-5">
          If this is describing your situation, tell me what is going on. I read
          what comes in myself, and I will tell you whether it is something I can
          help with.
        </p>
        <Link
          to={to}
          className="inline-block px-6 py-2.5 border border-gold/40 text-gold hover:bg-gold/10 transition-colors text-sm tracking-wide"
        >
          Tell me about your situation
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center mt-12">
      <Link
        to={to}
        className="inline-block px-8 py-3 border border-gold/40 text-gold hover:bg-gold/10 transition-colors text-sm tracking-wide"
      >
        Tell me about your situation
      </Link>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  // Per-page title and description. The SPA cannot serve these in the HTML a
  // crawler first sees -- that needs pre-rendering -- but setting them here at
  // least gives the browser tab and any JS-executing crawler the right values
  // instead of the single site-wide title every page currently shares.
  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    document.title = `${post.title} | Justin D. Leigh`;
    const d = document.querySelector('meta[name="description"]');
    const prevDesc = d ? d.getAttribute("content") : null;
    if (d) d.setAttribute("content", post.description);
    return () => {
      document.title = prevTitle;
      if (d && prevDesc !== null) d.setAttribute("content", prevDesc);
    };
  }, [post]);

  if (!post) {
    return (
      <section className="min-h-screen bg-black pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl text-white mb-4">Article not found</h1>
          <Link to="/blog" className="text-gold hover:text-gold-light transition-colors">
            Back to all articles
          </Link>
        </div>
      </section>
    );
  }

  // Roughly two fifths in, and never inside the closing material: the last
  // three sections of every article are "what a lawyer does", "about my
  // practice" and the disclaimer, and an invitation sitting on top of those
  // reads as a sales page rather than an offer to help. Articles too short to
  // have a middle get the one at the end only.
  const body = post.sections.length - 3;
  const askAfter = body >= 4 ? Math.floor(body * 0.4) : -1;

  const idx = posts.findIndex((p) => p.slug === slug);
  const next = posts[(idx + 1) % posts.length];

  // Articles that cover the same ground name each other in posts.json. Without
  // this, "Read next" was whatever happened to sit beside the article in the
  // file, and two articles on the same subject had no way to point at one
  // another. Falls back to that neighbour when a post names nobody.
  const related = (post.related || [])
    .map((s) => posts.find((p) => p.slug === s))
    .filter(Boolean);
  const reading = related.length ? related : [next];

  return (
    <section className="min-h-screen bg-black pt-28 pb-16 px-6">
      <article className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="text-[11px] uppercase tracking-[3px] text-gold hover:text-gold-light transition-colors"
        >
          ← All articles
        </Link>

        <h1 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-light text-white mt-6 mb-5 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/40 text-xs mb-10 pb-10 border-b border-white/5">
          <span>Justin D. Leigh, Attorney-at-Law</span>
          <span className="text-white/20">·</span>
          <span>{post.minutes} min read</span>
          {post.published && (
            <>
              <span className="text-white/20">·</span>
              {/* The closing disclaimer on every article says the law is
                  current "as of publication". Until now no article printed a
                  publication date, so that sentence pointed at nothing. The
                  ethics review on the landlord-tenant piece caught it.
                  Parsed as a plain date, not a timestamp, so it renders the
                  same in every timezone. */}
              <time dateTime={post.published}>
                {new Date(post.published + "T12:00:00").toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </time>
            </>
          )}
        </div>

        <p className="text-white/85 text-lg leading-relaxed mb-6">{post.lede}</p>
        {(post.intro || []).map((t, i) => (
          <p key={i} className="text-white/75 text-base leading-relaxed mb-5">
            {t}
          </p>
        ))}

        {post.sections.map((s, i) => (
          <div key={i} className="mt-12">
            {s.heading && (
              <h2 className="font-serif text-2xl text-white mb-5 leading-snug">
                {s.heading}
              </h2>
            )}
            {s.paras.map((p, j) =>
              p.sub ? (
                <h3
                  key={j}
                  className="text-[11px] font-semibold tracking-[3px] uppercase text-gold mt-8 mb-3"
                >
                  {p.sub}
                </h3>
              ) : (
                <p key={j} className="text-white/75 text-base leading-relaxed mb-5">
                  {p.p}
                </p>
              )
            )}
            {figuresAfter(slug, i).map((spec, k) => (
              <Figure key={k} spec={spec} />
            ))}
            {i === askAfter && <AskLink post={post} variant="inline" />}
          </div>
        ))}

        <div className="mt-16 pt-10 border-t border-white/5">
          <p className="text-white/40 text-xs leading-relaxed mb-8">
            This article is general information about Washington law, current as of
            publication. It is not legal advice, it does not create an attorney-client
            relationship, and the law changes. For advice on your own situation, speak to
            a lawyer.
          </p>

          <div className="glass p-6 border border-white/5">
            <span className="text-[11px] uppercase tracking-[3px] text-gold block mb-3">
              {related.length ? "Related" : "Read next"}
            </span>
            <div className="flex flex-col gap-3">
              {reading.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="font-serif text-xl text-white hover:text-gold-light transition-colors leading-snug block"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>

          <AskLink post={post} />
        </div>
      </article>
    </section>
  );
}
