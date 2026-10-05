import { useEffect } from "react";

/**
 * Give the Evergreen route its own favicon, link preview and theme color.
 *
 * index.html carries one global set of favicon links and one og:image, which is
 * right for the law firm and wrong for a separate trade name. This swaps them
 * while the Evergreen page is mounted and puts the firm's back on the way out,
 * so client-side navigation to any other route restores the firm's identity.
 *
 * It also survives into the static build: prerender.mjs serializes the live DOM
 * after the page paints, and its addHeadTags() rewrites canonical, og:url,
 * og:title, og:description and the twitter title/description pair but leaves
 * og:image and the icons alone. So what this sets is what crawlers see.
 */

const ORIGIN = "https://www.justindleigh.com";
const BASE = "/brand/evergreen";

const ICONS = [
  { rel: "icon", type: "image/svg+xml", href: `${BASE}/favicon/favicon.svg` },
  { rel: "icon", sizes: "any", href: `${BASE}/favicon/favicon.ico` },
  { rel: "icon", type: "image/png", sizes: "32x32", href: `${BASE}/favicon/favicon-32.png` },
  { rel: "icon", type: "image/png", sizes: "192x192", href: `${BASE}/favicon/icon-192.png` },
  { rel: "apple-touch-icon", sizes: "180x180", href: `${BASE}/favicon/apple-touch-icon.png` },
];

const META = {
  "og:image": `${ORIGIN}${BASE}/social/og-image-1200x630.png`,
  "og:image:width": "1200",
  "og:image:height": "630",
  "og:site_name": "Evergreen Legal AI",
  "twitter:image": `${ORIGIN}${BASE}/social/og-image-1200x630.png`,
  "theme-color": "#0C2C56",
};

/** og:* lives on property=, twitter:* and theme-color on name=. */
function selectorFor(key) {
  return key.startsWith("og:")
    ? `meta[property="${key}"]`
    : `meta[name="${key}"]`;
}

export default function useEvergreenHead() {
  useEffect(() => {
    const head = document.head;

    // Park the firm's icons rather than deleting them: they go back on unmount.
    const parked = Array.from(head.querySelectorAll('link[rel*="icon"]'));
    parked.forEach((el) => el.remove());

    const added = ICONS.map(({ rel, type, sizes, href }) => {
      const el = document.createElement("link");
      el.rel = rel;
      if (type) el.type = type;
      if (sizes) el.setAttribute("sizes", sizes);
      el.href = href;
      head.appendChild(el);
      return el;
    });

    // Meta tags mostly already exist with the firm's values, so remember the
    // old content and write it back rather than removing and re-creating.
    const restores = [];
    for (const [key, value] of Object.entries(META)) {
      let el = head.querySelector(selectorFor(key));
      if (el) {
        restores.push({ el, previous: el.getAttribute("content") });
      } else {
        el = document.createElement("meta");
        if (key.startsWith("og:")) el.setAttribute("property", key);
        else el.setAttribute("name", key);
        head.appendChild(el);
        restores.push({ el, previous: null });
      }
      el.setAttribute("content", value);
    }

    document.body.classList.add("evergreen-page");

    return () => {
      added.forEach((el) => el.remove());
      parked.forEach((el) => head.appendChild(el));
      restores.forEach(({ el, previous }) => {
        if (previous === null) el.remove();
        else el.setAttribute("content", previous);
      });
      document.body.classList.remove("evergreen-page");
    };
  }, []);
}
