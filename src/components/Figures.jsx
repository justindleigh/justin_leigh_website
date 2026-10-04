// Figures that break up the article text.
//
// Built from HTML rather than SVG on purpose: text reflows at phone width,
// the existing theme tokens carry light mode for free, and screen readers get
// real text instead of a flat image. Nothing here is decorative -- each figure
// carries something the prose states, so it reads as a summary, not clip art.

function Caption({ children }) {
  if (!children) return null;
  return (
    <figcaption className="text-white/35 text-xs mt-4 leading-relaxed">
      {children}
    </figcaption>
  );
}

function Shell({ label, caption, children }) {
  return (
    <figure className="my-12">
      <div className="glass border border-white/5 p-6 sm:p-7">
        {label && (
          <span className="text-[10px] font-semibold tracking-[3px] uppercase text-gold block mb-6">
            {label}
          </span>
        )}
        {children}
      </div>
      <Caption>{caption}</Caption>
    </figure>
  );
}

// A left-to-right process that stacks on a phone.
function Flow({ label, caption, steps }) {
  return (
    <Shell label={label} caption={caption}>
      <ol className="grid gap-4 sm:gap-3" style={{ gridTemplateColumns: "1fr" }}>
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3">
          {steps.map((s, i) => (
            <li key={i} className="flex-1 min-w-0 flex sm:flex-col items-start gap-3">
              <div className="flex sm:w-full items-center gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full border border-gold/40 text-gold text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                <span className="hidden sm:block h-px flex-1 bg-white/10" />
              </div>
              <div className="min-w-0">
                <span className="block text-white text-sm font-medium leading-snug">
                  {s.title}
                </span>
                {s.note && (
                  <span className="block text-white/50 text-xs mt-1.5 leading-relaxed">
                    {s.note}
                  </span>
                )}
              </div>
            </li>
          ))}
        </div>
      </ol>
    </Shell>
  );
}

// One question, several mutually exclusive answers.
function Decision({ label, caption, question, branches }) {
  return (
    <Shell label={label} caption={caption}>
      <p className="font-serif text-lg text-white mb-6 leading-snug">{question}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {branches.map((b, i) => (
          <div
            key={i}
            className="border border-white/5 bg-white/[0.02] p-4 min-w-0"
          >
            <span className="block text-[10px] uppercase tracking-[2px] text-gold mb-2">
              {b.test}
            </span>
            <span className="block text-white text-sm font-medium leading-snug">
              {b.result}
            </span>
            {b.note && (
              <span className="block text-white/50 text-xs mt-2 leading-relaxed">
                {b.note}
              </span>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}

// Ordered deadlines down the page.
function Timeline({ label, caption, events }) {
  return (
    <Shell label={label} caption={caption}>
      <ol className="relative">
        <span
          className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10"
          aria-hidden="true"
        />
        {events.map((e, i) => (
          <li key={i} className="relative pl-7 pb-6 last:pb-0 min-w-0">
            <span
              className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border border-gold/50 bg-black"
              aria-hidden="true"
            />
            <span className="block text-gold text-xs font-semibold tracking-wide mb-1">
              {e.when}
            </span>
            <span className="block text-white text-sm leading-snug">{e.what}</span>
            {e.note && (
              <span className="block text-white/50 text-xs mt-1.5 leading-relaxed">
                {e.note}
              </span>
            )}
          </li>
        ))}
      </ol>
    </Shell>
  );
}

// Two or three options set against each other.
function Compare({ label, caption, columns }) {
  return (
    <Shell label={label} caption={caption}>
      <div className="grid sm:grid-cols-3 gap-3">
        {columns.map((c, i) => (
          <div key={i} className="border border-white/5 bg-white/[0.02] p-4 min-w-0">
            <span className="block font-serif text-base text-white mb-1">
              {c.title}
            </span>
            <span className="block text-[10px] uppercase tracking-[2px] text-gold mb-3">
              {c.when}
            </span>
            <ul className="space-y-1.5">
              {c.points.map((p, j) => (
                <li
                  key={j}
                  className="text-white/60 text-xs leading-relaxed pl-3 relative"
                >
                  <span className="absolute left-0 top-[7px] w-1 h-1 rounded-full bg-gold/50" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// A set of things that must all be true.
function Elements({ label, caption, intro, items }) {
  return (
    <Shell label={label} caption={caption}>
      {intro && <p className="text-white/60 text-sm mb-5 leading-relaxed">{intro}</p>}
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
        {items.map((it, i) => (
          <div key={i} className="flex gap-3 min-w-0">
            <span className="shrink-0 text-gold text-xs mt-0.5 font-semibold tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <span className="block text-white text-sm leading-snug">{it.title}</span>
              {it.note && (
                <span className="block text-white/50 text-xs mt-1 leading-relaxed">
                  {it.note}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

const KINDS = { flow: Flow, decision: Decision, timeline: Timeline, compare: Compare, elements: Elements };

export function Figure({ spec }) {
  const C = KINDS[spec.kind];
  return C ? <C {...spec} /> : null;
}

// slug -> figures, each placed after the section at index `after`.
export const FIGURES = {
  "dividing-developing-land-washington": [
    {
      after: 0,
      kind: "decision",
      label: "Which process applies",
      question: "How many lots will exist when you are finished, and are you creating a new one?",
      branches: [
        {
          test: "No new lot",
          result: "Boundary line adjustment",
          note: "Exempt from the subdivision chapter, so long as no additional lot is created and nothing is left below minimum building site requirements.",
        },
        {
          test: "Four or fewer",
          result: "Short plat",
          note: "Usually administrative. Cities and towns, and GMA counties inside urban growth areas, may raise this ceiling to nine by ordinance.",
        },
        {
          test: "Five or more",
          result: "Full subdivision",
          note: "Preliminary plat, where the conditions are set, then final plat.",
        },
        {
          test: "Commercial, industrial, or condominium",
          result: "Binding site plan",
          note: "An approved binding site plan exempts the division from the subdivision chapter.",
        },
      ],
      caption:
        "The lot count and whether a new lot is created decide the track. The ceiling for a short subdivision is set locally, so confirm it in the code that governs your parcel.",
    },
    {
      after: 5,
      kind: "elements",
      label: "What the state now requires on ADUs",
      intro:
        "Inside urban growth areas, in zones allowing single-family homes, for cities and counties planning under the Growth Management Act.",
      items: [
        { title: "Two ADUs per lot", note: "One attached and one detached, two attached, or two detached." },
        { title: "No owner-occupancy requirement", note: "The jurisdiction may not require the owner to live on the lot." },
        { title: "Impact fees capped", note: "No more than half what would be imposed on the principal unit." },
        { title: "Parking limited", note: "Constrained near major transit stops and on smaller lots." },
        { title: "Lot size", note: "Permitted on any lot meeting the minimum for the principal unit." },
        { title: "Everything else still applies", note: "Setbacks, height, lot coverage, critical areas, utility capacity." },
      ],
      caption: "RCW 36.70A.681 sets a floor. It does not displace the rest of the code.",
    },
  ],

  "ai-governance-for-law-firms": [
    {
      after: 1,
      kind: "elements",
      label: "What a usable policy answers",
      intro: "Five questions. Only one of them is about the technology.",
      items: [
        { title: "Which tools are approved", note: "And who approves a new one." },
        { title: "What information goes where", note: "Concrete enough to apply at four in the afternoon." },
        { title: "What must be verified", note: "And by whom, before it leaves the office." },
        { title: "What gets recorded", note: "So a question six months later has an answer." },
        { title: "What happens when someone gets it wrong", note: "A reporting path, not a penalty." },
      ],
      caption: "Two pages that are followed beat twenty that are not.",
    },
    {
      after: 4,
      kind: "compare",
      label: "Build, buy, or assemble",
      columns: [
        {
          title: "Buy",
          when: "Common problem",
          points: [
            "The product is mature",
            "The work is not where you differentiate",
            "Research and document review usually sit here",
          ],
        },
        {
          title: "Build",
          when: "The problem is yours",
          points: [
            "Your forms, your matter history",
            "Value is in the arrangement, not the model",
            "Beats a general platform that knows nothing about your material",
          ],
        },
        {
          title: "Assemble",
          when: "Where most firms land",
          points: [
            "Components you control",
            "Your material stays on your hardware",
            "Add only the pieces that earn their place",
          ],
        },
      ],
      caption:
        "The deciding question is not technical ambition. It is whether what you want is a commodity or is specific to how you practice.",
    },
  ],

  "washington-land-use-permitting-appeals": [
    {
      after: 3,
      kind: "timeline",
      label: "The clock after a decision issues",
      events: [
        { when: "Day 0", what: "The land use decision issues", note: "A final determination by the body or officer with the highest level of authority to make it." },
        { when: "Administrative appeal first", what: "Where the local code provides one, it is a prerequisite", note: "Skipping it ends the case on exhaustion grounds." },
        { when: "21 days", what: "Petition must be filed AND served", note: "Filing alone does not preserve it. Service must be completed inside the period." },
        { when: "After", what: "Review on the record, not a new hearing", note: "The superior court sits without a jury and may grant relief only on the statutory standards." },
      ],
      caption:
        "The deadline is short, it requires completed service rather than merely filing, and it runs from the decision. Read the date on the decision first.",
    },
  ],

  "adverse-possession-washington": [
    {
      after: 1,
      kind: "elements",
      label: "What must be true, and for how long",
      intro: "Every element must exist concurrently throughout the statutory period.",
      items: [
        { title: "Exclusive", note: "Possession to the exclusion of the true owner." },
        { title: "Actual and uninterrupted", note: "Continuous, not occasional." },
        { title: "Open and notorious", note: "Visible enough that an owner would notice." },
        { title: "Hostile, under claim of right", note: "Judged by how the possessor treats the land, not by what they believed." },
      ],
      caption:
        "Ten years under RCW 4.16.020. A sincere belief that the fence was the boundary does not disqualify a claim, and knowing better does not defeat one.",
    },
  ],

  "probate-in-washington": [
    {
      after: 1,
      kind: "flow",
      label: "How a Washington probate runs",
      steps: [
        { title: "Petition and appointment", note: "The personal representative is appointed and letters issue." },
        { title: "Nonintervention powers", note: "Where granted, administration proceeds without court orders." },
        { title: "Notice and creditor claims", note: "The claim period is what makes the timeline." },
        { title: "Distribution and closing", note: "Declaration of completion, or a court-supervised accounting." },
      ],
      caption:
        "Nonintervention powers are the usual path, and they remove the court from administration almost entirely.",
    },
  ],
};
