import { useState } from "react";
import useInView from "../hooks/useInView";

const areas = [
  {
    title: "Real Estate & Land Use",
    desc: "Property acquisition, development guidance, land use planning, and zoning law for public and private clients.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M3 21h18M3 7v1a3 3 0 006 0V7m0 0V4h6v3m0 0v1a3 3 0 006 0V7M6 21V10m12 11V10M3 7h18" /></svg>,
    bullets: [
      "Transactional Representation",
      "Purchase and Sale Agreements",
      "Seller-Financed Transactions",
      "Title Research",
      "Easements",
      "Boundary Line Adjustments & Dispute Resolution",
      "Deed Preparation",
      "Residential & Commercial Leases",
      "Quiet Title & Adverse Possession",
      "Land Use and Environmental Due Diligence",
      "Site Plans and Conditional Use Permits",
      "Re-zones & Variances",
      "Short Plats and Subdivisions",
      "Growth Management Act Compliance",
      "SEPA Checklists",
      "Contract services for companies and municipalities",
    ],
  },
  {
    title: "Landlord-Tenant",
    desc: "Balanced representation for both landlords and tenants in rental property disputes and agreements.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M9 22V12h6v10" /></svg>,
    bullets: [
      "Evictions & Ejectment Actions",
      "Tenant Defense",
      "Residential & Commercial Leases",
      "Lease Review & Negotiation",
      "Security Deposit Disputes",
    ],
  },
  {
    title: "Estate Planning & Probates",
    desc: "Protect your legacy with comprehensive estate planning, wills, trusts, and probate administration.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    bullets: [
      "Wills",
      "Trusts",
      "Transfer on Death Deeds",
      "Lack of Probate Affidavits",
      "Family Partnerships",
      "Community Property Agreements",
      "Powers of Attorney",
      "Medical Directives",
      "Probate Administration & Dispute Resolution",
    ],
  },
  {
    title: "Personal Injury",
    desc: "Contingency-based representation for negligence claims - you don't pay unless I win.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    bullets: [
      "Auto Accidents",
      "Slip and Fall",
      "Premises Liability",
      "Wrongful Death",
      "Insurance Claims & Disputes",
    ],
  },
  {
    title: "Business Strategy",
    desc: "Strategic counsel for startups and established entrepreneurs from formation through growth.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    bullets: [
      "Entity Formation / Investment Structure",
      "Operating Agreements & Bylaws",
      "Corporate Administration",
      "Buy-Sell Agreements",
      "Shareholder Agreements",
      "Partnership Disputes",
      "Regulatory Matters",
      "Licensing",
      "Human Resources",
      "Sale of Business",
      "Trademark Law",
    ],
  },
  {
    title: "Criminal Defense",
    desc: "Vigorous defense of your rights with personalized attention to every detail of your case.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
    bullets: [
      "Discrete, personalized criminal defense representation for select clients.",
    ],
  },
  {
    title: "Civil Litigation",
    desc: "Strategic advocacy in civil disputes, from initial case assessment through resolution or trial.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>,
    bullets: [
      "Personal Injury",
      "Evictions & Ejectment Actions",
      "Tenant Defense",
      "Real Estate Disputes",
      "Foreclosure Defense",
      "Real Estate Forfeitures",
      "Quiet Title / Adverse Possession Claims",
      "Civil Rights & Discrimination Claims",
      "Fair Housing Litigation",
      "First Amendment Violations",
    ],
  },
  {
    title: "Employment (Employee-Side)",
    desc: "Protecting employees' rights in the workplace with dedicated, compassionate representation.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
    bullets: [
      "Discrimination & Harassment",
      "Retaliation & Wrongful Termination",
      "Wage & Hour Violations",
      "Medical Leave and Accommodation",
      "Public Sector Employment",
      "Whistleblower Claims",
      "Contracts & Separation",
    ],
  },
  {
    title: "Family Law",
    desc: "Guiding families through life's most challenging transitions with compassion and skilled advocacy.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
    bullets: [
      "Divorce & Legal Separation",
      "Child Custody & Parenting Plans",
      "Child Support Modifications",
      "Spousal Maintenance (Alimony)",
      "Domestic Violence Protection Orders",
    ],
  },
];

function ExpandIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`w-4 h-4 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function PracticeAreas() {
  const [ref, inView] = useInView();
  const [expanded, setExpanded] = useState(null);

  function toggle(i) {
    setExpanded(expanded === i ? null : i);
  }

  return (
    <section id="practice" className="relative bg-black py-28 px-6">
      <div className="practice-top-gradient absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto relative">
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-white">
            Comprehensive{" "}
            <span className="text-gradient-gold font-semibold">Legal Services</span>
          </h2>
          <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
          {areas.map((area, i) => {
            const isOpen = expanded === i;
            return (
              <button
                key={area.title}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`practice-area-${i}`}
                className={`group bg-black p-8 transition-all duration-500 relative cursor-pointer text-left w-full ${
                  isOpen ? "bg-white/[0.03]" : "hover:bg-white/[0.03]"
                } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                style={{
                  transitionDelay: inView ? `${0.1 + i * 0.07}s` : "0s",
                  transitionDuration: "0.6s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onClick={() => toggle(i)}
              >
                <div className={`absolute inset-x-0 top-0 h-px bg-gold transition-transform duration-500 origin-left ${isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className={`w-12 h-12 bg-gold/10 text-gold flex items-center justify-center mb-5 transition-colors ${isOpen ? "bg-gold/20" : "group-hover:bg-gold/20"}`}>
                      {area.icon}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-white mb-3">{area.title}</h3>
                    <p className={`text-sm leading-relaxed transition-colors ${isOpen ? "text-white/50" : "text-white/35 group-hover:text-white/50"}`}>{area.desc}</p>
                  </div>
                  <div className="mt-1 flex-shrink-0">
                    <ExpandIcon open={isOpen} />
                  </div>
                </div>

                {/* Expandable bullet points */}
                <div
                  id={`practice-area-${i}`}
                  role="region"
                  aria-hidden={!isOpen}
                  className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    maxHeight: isOpen ? `${area.bullets.length * 36 + 24}px` : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <ul className="mt-5 pt-4 border-t border-white/5 space-y-2">
                    {area.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm text-white/60">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
