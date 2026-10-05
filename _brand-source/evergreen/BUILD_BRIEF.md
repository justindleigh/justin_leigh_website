# Build brief for Claude Code: Evergreen Legal AI page

Paste this file (or point Claude Code at it) from the root of the law-firm website repo. The `evergreen-brand` folder this file came in should be copied into the repo first. A good place is `/_brand-source/evergreen` (outside the public folder).

---

## Prompt to give Claude Code

> You're working in the website repo for the Law Office of Justin D. Leigh (Justin D Leigh PLLC), which deploys on Vercel. Add a **separate page** for a new trade name, **Evergreen Legal AI**, using the brand package in `_brand-source/evergreen/`. Read `_brand-source/evergreen/BUILD_BRIEF.md` and `BRAND_GUIDE.md` in full before you start.
>
> 1. Inspect the repo first. Find the framework (Next.js App or Pages Router, Astro, plain HTML, etc.), the styling approach (Tailwind version, CSS modules, global CSS), and how routes and metadata work. Tell me what you found and your plan before editing.
> 2. Create a new route at **`/evergreen-legal-ai`** (ask me if I want a different slug or a subdomain). The page must have its **own** look: its own header, footer, fonts, colors, favicon, and Open Graph image. It should not inherit the law firm's header/footer or theme. Scope all Evergreen styles under a `.evergreen` wrapper or the `eg-` Tailwind prefix so nothing leaks into the existing site.
> 3. Copy the web assets into the public folder at **`/brand/evergreen/`**, keeping the subfolders (`logo/`, `favicon/`, `social/`). Use the SVG logos in markup. Use PNGs only for OG/social metadata and the apple-touch icon.
> 4. Port `reference/index.html` into the framework's page format. Treat it as the design and content spec: keep the section order, type, spacing, and colors. Use the framework's font loader (for example `next/font/google` for Cormorant Garamond 600 + italic 500 and Manrope 400/600/700), or the Google Fonts link if there isn't one.
> 5. Set page-level metadata: the title, description, canonical URL, OG/Twitter image `/brand/evergreen/social/og-image-1200x630.png`, and the Evergreen favicon set (page-scoped if the framework allows; otherwise tell me the tradeoff).
> 6. Leave every `[CONFIRM …]`, `[CONTACT EMAIL]`, and `[ATTORNEY REVIEW REQUIRED …]` placeholder visible and list them all for me at the end. **Do not invent services, credentials, results, testimonials, or disclaimer language.**
> 7. Add one discreet link from the main law-firm site to the new page (footer is fine) and a link back from the Evergreen page to the main site. Ask before changing anything else on existing pages.
> 8. Check it: build passes, no console errors, Lighthouse accessibility ≥ 95, layout works at 375px / 768px / 1280px, keyboard focus is visible, and the logo alt text is right. Then create a branch, commit, push, and give me the Vercel preview URL. **Don't merge to production** until I approve.

---

## Page spec (summary)

| Section | Content | Notes |
|---|---|---|
| Header | Horizontal color logo (`evergreen-horizontal-color.svg`, ~44px tall), anchor nav, "Start a conversation" button | White background, hairline bottom border |
| Hero | Navy background, "LEGAL · AI" label, H1, one-line positioning, italic "Offered by Justin D Leigh PLLC", two buttons | Large faint white mark as a watermark at the right |
| Services | 4 cards | Content is placeholder; Justin supplies it |
| Approach | 3 numbered steps | Placeholder |
| About | Headshot + bio, link back to the law firm site | Placeholder |
| CTA | Teal band, email button | `[CONTACT EMAIL]` |
| Footer | Reversed "offered by" logo, trade-name statement, disclaimer slot | Disclaimer must be written or approved by Justin |

## Head tags (adjust paths if the slug changes)

```html
<link rel="icon" href="/brand/evergreen/favicon/favicon.ico" sizes="any">
<link rel="icon" href="/brand/evergreen/favicon/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/brand/evergreen/favicon/apple-touch-icon.png">
<link rel="manifest" href="/brand/evergreen/favicon/site.webmanifest">
<meta name="theme-color" content="#0C2C56">
<meta property="og:image" content="https://[DOMAIN]/brand/evergreen/social/og-image-1200x630.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

## Guardrails

- The SVG logos are outlined (no font dependency), so don't retype the logo as live text.
- Don't recolor the logos. Use the provided variants: `color` on light backgrounds, `reversed` on navy, `white`/`navy` for one-color uses.
- `teal-light` (#5CC6C0) is for use on navy only. It fails contrast on white.
- Fonts are SIL Open Font License (licenses in `fonts/`), so they're free for web use.
