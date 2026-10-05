import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Every page used to serve the home page's title and description, so all of
// them competed as duplicates in search results. This sets the pair per route.
// Blog posts are absent on purpose: BlogPost sets its own from the article.
const META = {
  "/": {
    title: "Justin D. Leigh | Attorney in Spokane, WA | Downtown Spokane Lawyer",
    description:
      "Justin D. Leigh is an independent attorney in downtown Spokane, WA offering real estate, business, estate planning, personal injury, family law, and litigation services. Free consultations, by appointment.",
  },
  "/contact": {
    title: "Schedule a Consultation | Justin D. Leigh, Spokane Attorney",
    description:
      "Request a consultation with Justin D. Leigh, an independent attorney in downtown Spokane. Free initial consultation, by appointment, admitted in Washington and Oregon.",
  },
  "/evergreen-legal-ai": {
    title: "Evergreen Legal AI | Practical AI for the practice of law",
    description:
      "Evergreen Legal AI helps lawyers and law firms adopt AI responsibly: integration, tool strategy, training, compliance, auditing, and risk. Offered by Justin D Leigh PLLC.",
  },
  "/alcohol-beverage-law": {
    title: "Alcohol Beverage Law | Washington Liquor Licensing | Justin D. Leigh",
    description:
      "Washington liquor licensing and WSLCB compliance for breweries, wineries, distilleries, bars, and restaurants, from an attorney who has owned a brewery and a winery.",
  },
  "/blog": {
    title: "Notes on Washington Law | Justin D. Leigh",
    description:
      "Plain explanations of the Washington law questions people call about most often: real estate, land use, probate, business, employment, and civil rights.",
  },
  "/privacy": {
    title: "Privacy Policy | Justin D. Leigh, PLLC",
    description:
      "How Justin D. Leigh, PLLC collects, uses, stores, and protects personal information submitted through this website and client portal.",
  },
  "/terms": {
    title: "Terms of Use | Justin D. Leigh, PLLC",
    description:
      "Terms governing use of this website, including the absence of an attorney-client relationship, call recording, and limitations of liability.",
  },
  "/accessibility": {
    title: "Accessibility Statement | Justin D. Leigh, PLLC",
    description:
      "This website's accessibility commitment, the WCAG 2.1 Level AA standard it works toward, known limitations, and how to report a barrier.",
  },
};

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const key = pathname.length > 1 ? pathname.replace(/\/$/, "") : "/";
    const m = META[key];
    if (!m) return; // a blog post: BlogPost sets its own
    document.title = m.title;
    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.setAttribute("content", m.description);
  }, [pathname]);

  return null;
}
