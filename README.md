# Calmoniq marketing site

Static marketing site for **calmoniq.com**, positioning the desktop app
(replaces the SaaS landing page). Plain HTML/CSS/JS — no build step.

## Files
- `index.html` — the page
- `styles.css` — styling (brand green, responsive)
- `app.js` — OS-aware download button + CASL-compliant newsletter handling
- `assets/` — app icon + screenshots
- `serve.cjs` — local preview only (`node website/serve.cjs` → http://127.0.0.1:4178); not needed in production

## Deploy
Drop the `website/` folder on any static host:
- **Netlify / Vercel / Cloudflare Pages:** point the project at this folder, no build command, publish directory = `website`.
- **GitHub Pages:** push `website/` contents to a `gh-pages` branch or `/docs`.

Then point the **calmoniq.com** DNS at the host. Do this only when you're ready
to switch the domain away from the Replit SaaS.

## Before launch — two plug-ins
1. **Newsletter (CASL-compliant):** in `index.html` replace `action="NEWSLETTER_ENDPOINT"`
   with your provider's form action (Buttondown / MailerLite / Formspree). The consent
   checkbox is unchecked + required as Canadian anti-spam law requires. Every email you
   send must include your identity and an unsubscribe link. Until the endpoint is set,
   the form falls back to a mailto so no signup is lost.
2. **Checkout link:** the Buy button points to
   `https://calmoniq.lemonsqueezy.com/checkout/buy/1783769` — confirm against the
   product's Share link in Lemon Squeezy.

## Notes
- Download buttons link to the public releases repo's `latest` release.
- No analytics/tracking — consistent with the app's privacy-first promise. If you add
  analytics later, use a privacy-friendly tool (Plausible/Fathom) and disclose it.
