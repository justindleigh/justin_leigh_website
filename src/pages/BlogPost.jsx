import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import posts from "../data/posts.json";
import { FIGURES, Figure } from "../components/Figures";

function figuresAfter(slug, index) {
  return (FIGURES[slug] || []).filter((f) => f.after === index);
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

  const idx = posts.findIndex((p) => p.slug === slug);
  const next = posts[(idx + 1) % posts.length];

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

        <div className="flex items-center gap-4 text-white/40 text-xs mb-10 pb-10 border-b border-white/5">
          <span>{post.minutes} min read</span>
          <span className="text-white/20">·</span>
          <span>Justin D. Leigh, Attorney-at-Law</span>
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
              Read next
            </span>
            <Link
              to={`/blog/${next.slug}`}
              className="font-serif text-xl text-white hover:text-gold-light transition-colors leading-snug block"
            >
              {next.title}
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-block px-8 py-3 border border-gold/40 text-gold hover:bg-gold/10 transition-colors text-sm tracking-wide"
            >
              Discuss your situation
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
