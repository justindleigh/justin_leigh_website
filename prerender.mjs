/**
 * Prerender every route to static HTML so crawlers get real content.
 *
 * The app is a Vite SPA: the HTML served is an empty <div id="root"> and the
 * text only appears after JavaScript runs. Google runs JS unreliably and never
 * promptly, so without this the articles are effectively invisible. Each route
 * is rendered in headless Chromium after the app paints, and the resulting DOM
 * is written to dist/<route>/index.html.
 *
 * Vercel checks the filesystem BEFORE applying the rewrite in vercel.json, so a
 * real file at that path wins and the SPA rewrite stays as the fallback for
 * anything not prerendered. The client app still boots on top of the markup.
 *
 * Puppeteer rather than a system Chrome path: this has to run on Vercel's Linux
 * build image as well as on Windows, and puppeteer ships its own Chromium.
 *
 * Runs automatically as part of `npm run build`.
 */
import { createServer } from "node:http";
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(HERE, "dist");
const ORIGIN = "https://www.justindleigh.com";
const PORT = 4399;

const STATIC_ROUTES = [
  "/", "/contact", "/evergreen-legal-ai", "/alcohol-beverage-law",
  "/blog", "/privacy", "/terms", "/accessibility",
];

// Evergreen is prerendered so the markup is real, but held out of the index and
// the sitemap while the [CONFIRM] and [ATTORNEY REVIEW REQUIRED] placeholders
// are still in the copy. Delete the entry to launch it; nothing else changes.
const NOINDEX = new Set(["/evergreen-legal-ai"]);

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
  ".txt": "text/plain", ".xml": "application/xml",
};

/** Serve dist the way Vercel will: real file first, index.html as fallback. */
function serveDist() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      let file = path.join(DIST, url);
      try {
        const s = await stat(file);
        if (s.isDirectory()) file = path.join(file, "index.html");
      } catch {
        file = path.join(DIST, "index.html");
      }
      try {
        const buf = await readFile(file);
        res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
        res.end(buf);
      } catch {
        res.writeHead(404).end("not found");
      }
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

function attr(html, re) {
  const m = html.match(re);
  return m ? m[1] : "";
}

/** Add the per-page tags the client app does not set itself. */
function addHeadTags(html, route) {
  const canonical = ORIGIN + (route === "/" ? "/" : route);
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);

  html = html
    .replace(/\s*<link rel="canonical"[^>]*>/g, "")
    .replace(/\s*<meta property="og:url"[^>]*>/g, "")
    .replace(/\s*<meta property="og:title"[^>]*>/g, "")
    .replace(/\s*<meta property="og:description"[^>]*>/g, "")
    .replace(/\s*<meta name="twitter:title"[^>]*>/g, "")
    .replace(/\s*<meta name="twitter:description"[^>]*>/g, "");

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const tags = [
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
  ];
  // index.html carries a site-wide "index, follow" robots tag. Leaving it in
  // place alongside a noindex would put two contradictory directives on the
  // page; strip the inherited one rather than rely on crawlers resolving it.
  if (NOINDEX.has(route)) {
    html = html.replace(/\s*<meta name="robots"[^>]*>/g, "");
    tags.push(`<meta name="robots" content="noindex,follow">`);
  }
  return html.replace("</head>", `  ${tags.join("\n  ")}\n</head>`);
}

// The articles went live on this date. Kept as a constant rather than "today"
// so a rebuild does not keep moving the publication date.
const PUBLISHED = "2026-10-04";

/** BlogPosting schema per article. The site-wide Attorney/LegalService block
 *  in index.html describes the firm; it says nothing about the article. */
function articleSchema(post, route) {
  const url = ORIGIN + route;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: PUBLISHED,
    dateModified: new Date().toISOString().slice(0, 10),
    wordCount: post.words,
    inLanguage: "en-US",
    ...(post.practiceArea ? { articleSection: post.practiceArea } : {}),
    author: {
      "@type": "Person",
      name: "Justin D. Leigh",
      jobTitle: "Attorney",
      url: ORIGIN,
    },
    publisher: {
      "@type": "LegalService",
      name: "Law Office of Justin D. Leigh",
      legalName: "Justin D. Leigh, PLLC",
      url: ORIGIN,
    },
  };
}

function injectSchema(html, obj) {
  const tag = `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
  return html.replace("</head>", `  ${tag}\n</head>`);
}

function textLength(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  if (!m) return 0;
  return m[1].replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ")
             .replace(/\s+/g, " ").trim().length;
}

async function writeRoute(route, html) {
  const dir = route === "/" ? DIST : path.join(DIST, route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
}

function sitemap(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const priority = (r) =>
    r === "/" ? "1.0" : r === "/blog" ? "0.9" : r.startsWith("/blog/") ? "0.8" : "0.7";
  const body = routes
    .filter((r) => !NOINDEX.has(r))
    .map((r) => `  <url>\n    <loc>${ORIGIN}${r === "/" ? "/" : r}</loc>\n` +
                `    <lastmod>${today}</lastmod>\n` +
                `    <priority>${priority(r)}</priority>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
         `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const posts = JSON.parse(await readFile(path.join(HERE, "src/data/posts.json"), "utf8"));
const routes = [...STATIC_ROUTES, ...posts.map((p) => `/blog/${p.slug}`)];
const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

const server = await serveDist();
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
console.log(`  prerendering ${routes.length} routes`);

const thin = [];
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2000 });
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:${PORT}${route}`, {
      waitUntil: "networkidle0", timeout: 45000,
    });
    // The app sets <title> in an effect; wait for it to stop being the shell.
    await page.waitForFunction("document.querySelector('#root').children.length > 0",
                               { timeout: 20000 });
    let html = "<!DOCTYPE html>\n" + await page.evaluate(() => document.documentElement.outerHTML);
    html = addHeadTags(html, route);
    const post = bySlug[route.replace("/blog/", "")];
    if (route.startsWith("/blog/") && post) {
      html = injectSchema(html, articleSchema(post, route));
    }
    const len = textLength(html);
    if (len < 600) thin.push([route, len]);
    await writeRoute(route, html);
    console.log(`    ${route.padEnd(50)} ${String(len).padStart(6)} chars`);
  }
  await writeFile(path.join(DIST, "sitemap.xml"), sitemap(routes), "utf8");
  console.log(`\n  sitemap.xml: ${routes.length} URLs`);
} finally {
  await browser.close();
  server.close();
}

if (thin.length) {
  console.log("\n  WARNING, these routes rendered thin:");
  for (const [r, n] of thin) console.log(`    ${r} (${n} chars)`);
  process.exitCode = 1;
}
