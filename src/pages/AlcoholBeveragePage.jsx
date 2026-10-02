import { Link } from "react-router-dom";

const services = [
  {
    title: "Licensing & Compliance",
    desc: "Navigate the complex web of federal, state, and local licensing requirements for breweries, wineries, distilleries, and taprooms.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    title: "Distributor Contracts & Dispute Resolution",
    desc: "Draft, review, and negotiate distribution agreements. Resolve disputes with distributors to protect your brand and margins.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>,
  },
  {
    title: "TTB COLA & Formula Approval",
    desc: "Streamline your Alcohol and Tobacco Tax and Trade Bureau certificate of label approval and formula submissions.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /><path d="M9 14l2 2 4-4" /></svg>,
  },
  {
    title: "FDA Compliance",
    desc: "Ensure your products, labeling, and facilities meet FDA requirements for food safety and ingredient disclosure.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  },
  {
    title: "Intellectual Property",
    desc: "Protect your brand names, logos, and recipes with trademark registration and trade secret strategy.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5zM6 9.01V9" /><path d="M15 5l6.3 6.3a2.4 2.4 0 010 3.4L17 19" /></svg>,
  },
  {
    title: "Enforcement Action Defense",
    desc: "Defend against regulatory actions, violations, and penalties from state liquor boards, the TTB, and other agencies.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" /></svg>,
  },
];

const awards = [
  "2024 Very Small Brewery of the Year (Washington Beer Awards)",
  "Gold, Silver & Bronze in Brett Beer category (2024)",
  "Silver in Belgian Style Ales for 'Lookie Loo' (2024)",
];

export default function AlcoholBeveragePage() {
  return (
    <section className="min-h-screen bg-black pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-strong mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gold">
              <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
              <path d="M6 1v3M10 1v3M14 1v3" />
            </svg>
            <span className="text-[12px] font-medium text-white/60 tracking-wide">INDUSTRY EXPERIENCE YOU CAN TRUST</span>
          </div>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-light text-white mb-4 leading-tight">
            Alcohol{" "}
            <span className="text-gradient-gold font-semibold">Beverage Law</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Legal counsel from an attorney who doesn't just understand the industry, he built a business in it.
            Justin D. Leigh is the founder of{" "}
            <span className="text-gradient-gold font-semibold">Dwinell Country Ales</span>, an
            award-winning farmhouse brewery in Washington.
          </p>
          <p className="text-white/50 text-sm max-w-2xl mx-auto leading-relaxed">
            From navigating federal licensing to resolving distributor disputes, Justin brings
            firsthand ownership experience to every alcohol beverage matter. When your attorney
            has walked the same path you're on, you get counsel you can actually trust.
          </p>

          {/* Brewery Headshot */}
          <div className="mt-10 max-w-md mx-auto">
            <img
              src="/brewery-headshot.webp"
              alt="Justin D. Leigh at Dwinell Country Ales"
              className="w-full object-cover border border-white/10"
            />
          </div>
        </div>

        {/* Dwinell Story */}
        <div className="mb-20 py-12 border-t border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-6 block text-center">
              Dwinell Country Ales
            </span>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-serif text-2xl text-white mb-4">Award-Winning Farmhouse Brewery</h2>
                <p className="text-white/60 text-[15px] leading-relaxed mb-4">
                  Founded in 2017, Dwinell Country Ales
                  became known for rustic saisons, barrel-aged mixed culture fruit beers, and
                  spontaneous fermentation using their own coolship.
                </p>
                <p className="text-white/60 text-[15px] leading-relaxed mb-4">
                  In 2023, the brewery expanded its offerings to include clean lagers, homegrown
                  orchard hard cider, and locally sourced natural wine. The 3,000+ square foot
                  facility included a tasting room, production space, and spacious patio.
                </p>
                <p className="text-white/60 text-[15px] leading-relaxed">
                  This real-world experience building and operating a licensed beverage business
                  from the ground up gives Justin a practical edge that most attorneys simply cannot offer.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-white mb-4">Recognition</h3>
                <div className="space-y-3">
                  {awards.map((award) => (
                    <div key={award} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm text-white/70">{award}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 glass-strong">
                  <div className="text-[10px] font-semibold tracking-[3px] uppercase text-gold/70 mb-2">The Advantage</div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    When your attorney has personally navigated TTB approvals, distributor
                    negotiations, state liquor board compliance, and taproom operations,
                    you get counsel rooted in real experience, not just textbook knowledge.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-4 block">
              How We Help
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-light text-white">
              Beverage Industry{" "}
              <span className="text-gradient-gold font-semibold">Legal Services</span>
            </h2>
            <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px">
            {services.map((s) => (
              <div key={s.title} className="bg-black p-8 hover:bg-white/[0.03] transition-all duration-500 group relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="w-14 h-14 bg-gold/10 text-gold flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  {s.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-sm leading-relaxed text-white/50 group-hover:text-white/70 transition-colors">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light text-white mb-4">
            Need Legal Counsel for Your{" "}
            <span className="text-gradient-gold font-semibold">Beverage Business?</span>
          </h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto mb-8">
            Whether you're launching a new brewery, expanding distribution, or facing a regulatory challenge,
            Justin brings the experience and expertise to help.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors"
            >
              Schedule Consultation
            </Link>
            <a
              href="tel:5094264415"
              className="glass-strong px-8 py-4 text-white/70 text-sm font-medium tracking-wide hover:text-white hover:bg-white/10 transition-all"
            >
              Call (509) 426-4415
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
