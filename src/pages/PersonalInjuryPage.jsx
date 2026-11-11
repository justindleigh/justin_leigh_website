import { Link } from "react-router-dom";

const icon = (d) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <path d={d} />
  </svg>
);

const cases = [
  {
    title: "Auto Accidents",
    desc: "Car and truck crashes on city streets and highways, including collisions with commercial vehicles.",
    icon: icon("M5 17h14M6 17l1.5-5h9L18 17M7 17v2M17 17v2M8 14h.01M16 14h.01"),
  },
  {
    title: "Motorcycle Accidents",
    desc: "Riders are hurt badly when a driver fails to see them, and insurers often try to put the blame on the rider.",
    icon: icon("M5 18a3 3 0 100-6 3 3 0 000 6zM19 18a3 3 0 100-6 3 3 0 000 6zM5 15l4-7h5l3 7M9 8h-2"),
  },
  {
    title: "Bicycle Accidents",
    desc: "Cyclists struck by cars, doored by parked vehicles or forced off the road by a careless driver.",
    icon: icon("M5 18a3 3 0 100-6 3 3 0 000 6zM19 18a3 3 0 100-6 3 3 0 000 6zM5 15l4-7h5l3 7M9 8h-2"),
  },
  {
    title: "Pedestrian Accidents",
    desc: "People on foot hit in crosswalks, parking lots and driveways by a driver who was not paying attention.",
    icon: icon("M12 7a3 3 0 100-6 3 3 0 000 6zM9 22l1-8-3-2 2-4h6l2 4-3 2 1 8"),
  },
  {
    title: "Injuries From DUI Crashes",
    desc: "Crashes caused by a driver who was impaired by alcohol or drugs.",
    icon: icon("M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"),
  },
  {
    title: "Motorist Insurance Claims",
    desc: "Claims against the other driver's insurer, and claims under your own policy when the other driver had no insurance or not enough.",
    icon: icon("M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8"),
  },
  {
    title: "Dog Bites",
    desc: "Injuries from a dog attack, whether on a sidewalk, in a park or on someone else's property.",
    icon: icon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"),
  },
  {
    title: "Slip and Fall",
    desc: "Falls caused by hazards a property owner should have fixed or warned about, in stores, rentals and public places.",
    icon: icon("M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"),
  },
  {
    title: "Assault and Battery",
    desc: "Civil claims for injuries caused by someone who attacked you, separate from any criminal case.",
    icon: icon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"),
  },
  {
    title: "Medical Malpractice",
    desc: "Injuries caused when a doctor, hospital or other provider fell below the standard of care.",
    icon: icon("M22 12h-4l-3 9L9 3l-3 9H2"),
  },
  {
    title: "Product Liability",
    desc: "Injuries caused by a defective product, a dangerous design or missing warnings.",
    icon: icon("M21 16V8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"),
  },
  {
    title: "Workers' Compensation",
    desc: "Injuries on the job, including help with the claim and with disputes over benefits.",
    icon: icon("M2 18h20M4 18v-3a8 8 0 0116 0v3M12 7v4"),
  },
  {
    title: "Catastrophic Injuries",
    desc: "Injuries that change how someone lives and works, where the claim has to account for care and lost income for years to come.",
    icon: icon("M22 12h-4l-3 9L9 3l-3 9H2"),
  },
  {
    title: "Pain and Suffering",
    desc: "Compensation for the pain, limits and loss of enjoyment an injury causes, on top of medical bills and lost wages.",
    icon: icon("M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"),
  },
  {
    title: "Wrongful Death",
    desc: "Claims brought by a family after someone they love was killed through another person's negligence.",
    icon: icon("M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"),
  },
];

const steps = [
  {
    title: "A free consultation",
    desc: "Tell me what happened. I will tell you honestly whether I think you have a claim worth pursuing.",
  },
  {
    title: "I deal with the insurance company",
    desc: "Once I represent you, the adjusters talk to me. You can focus on getting better.",
  },
  {
    title: "Building the claim",
    desc: "I gather the medical records, bills, wage loss and evidence of fault, and put a value on the claim before any offer is discussed.",
  },
  {
    title: "Settlement or trial",
    desc: "Most claims resolve by settlement. If the insurer will not pay a fair amount, the case goes to court.",
  },
];

export default function PersonalInjuryPage() {
  return (
    <section className="min-h-screen bg-black pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-light text-white mb-4 leading-tight">
            Personal{" "}
            <span className="text-gradient-gold font-semibold">Injury</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            If you were hurt because someone else was careless, I represent you against the
            people and insurance companies responsible.
          </p>
          <p className="text-white/50 text-sm max-w-2xl mx-auto leading-relaxed">
            I represent injured people in Spokane and across Eastern and Central Washington,
            including Spokane, Yakima, Benton, Franklin, Kittitas and Klickitat counties. I am
            licensed in Washington and Oregon and meet clients at my Spokane office by
            appointment. The first consultation is free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              to="/contact"
              className="px-8 py-4 bg-gold text-navy text-sm font-bold tracking-wide hover:bg-gold-light transition-colors"
            >
              Free Consultation
            </Link>
            <a
              href="tel:5094264415"
              className="glass-strong px-8 py-4 text-white/70 text-sm font-medium tracking-wide hover:text-white hover:bg-white/10 transition-all"
            >
              Call (509) 426-4415
            </a>
          </div>
        </div>

        {/* Cases */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-4 block">
              Cases I Handle
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-light text-white">
              Personal Injury{" "}
              <span className="text-gradient-gold font-semibold">Claims</span>
            </h2>
            <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px">
            {cases.map((s) => (
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
          <p className="text-center text-white/50 text-sm max-w-2xl mx-auto mt-10 leading-relaxed">
            If you were hurt some other way because of someone else's carelessness, call anyway.
            Many injury claims do not fit neatly into a category.
          </p>
        </div>

        {/* How it works */}
        <div className="mb-20 py-12 border-t border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-gold mb-6 block text-center">
              How It Works
            </span>
            <div className="grid md:grid-cols-2 gap-10">
              {steps.map((s, i) => (
                <div key={s.title} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gold/15 text-gold flex items-center justify-center flex-shrink-0 font-serif">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2">{s.title}</h3>
                    <p className="text-white/60 text-[15px] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 glass-strong">
              <div className="text-[10px] font-semibold tracking-[3px] uppercase text-gold/70 mb-2">Fees</div>
              <p className="text-white/80 text-sm leading-relaxed">
                Personal injury cases are handled on a contingency fee, which means my fee is a
                percentage of what you recover and there is no attorney fee if there is no
                recovery. How case costs are handled is set out in the written fee agreement
                before any work begins.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light text-white mb-4">
            Hurt in an{" "}
            <span className="text-gradient-gold font-semibold">Accident?</span>
          </h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto mb-8">
            Claims have deadlines, and evidence is easier to gather early. Call or send a message
            and I will get back to you.
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
