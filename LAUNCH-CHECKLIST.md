# GosaviOn Group launch audit

Updated 2 November 2026. Public deployment: https://city2trip.vercel.app/.
This checklist describes this repository, not the separate Bracketdex project.

## Fixes and checks

- Canonical URLs, Open Graph and Twitter metadata now share the production origin. An empty Business settings domain uses the existing Vercel address. A verified custom domain in admin overrides it.
- New branded sharing card: `public/images/gosavion-share.png`, actually 1200 × 630. Reproduce with `node scripts/generate-share-image.mjs`. Uses the existing logo and vehicle; no placeholder or customer endorsement.
- Sitemap includes all currently published, in-season services and tours plus six main pages. It excludes admin and API routes. Production robots allows crawling and advertises the sitemap; Vercel previews receive disallow rules and noindex metadata.
- Local crawl checks 16 public pages for distinct titles/descriptions, canonical URLs, Open Graph/Twitter tags and image alt attributes; 32 internal destinations return HTTP 200. Missing top-level, service and tour pages return HTTP 404 with recovery links. This is not a complete accessibility certification.
- Replaced the low-resolution Contact vehicle with the clean hero asset and corrected its inaccurate scenic-road alt text.
- Business phone `+91 9860252341` and email `gosaviongroup@gmail.com` were supplied by the owner and saved to shared settings. Contact, enquiry and footer reflect settings immediately. Privacy also displays the phone/email.
- Private booking storage is tested before email delivery, with idempotency, validation, consent, honeypot, status updates and protected admin reads. A synthetic integration record is removed after testing. No real notification email was sent during this audit.
- Admin `/admin` remains noindex and requires username/password. Public requests to the booking inbox receive HTTP 401.
- No analytics or advertising tags are installed. No consent banner is needed for optional trackers that are absent. Setting a GA4 environment variable alone does **not** install analytics in this app.
- No invented reviews, ratings, customers or review schema. WebSite/Organization structured data uses the same production origin and verified contact details.
- Optional `GOOGLE_SITE_VERIFICATION` token is supported in root metadata; DNS verification remains an alternative.

## Booking delivery: this site's actual flow

The browser validates the form, saves the request through `/api/bookings`, and then attempts Web3Forms email notification. The customer sees a saved receipt inline, not a `/thank-you` redirect. An email failure cannot discard the saved admin entry. A saved request is not a confirmed reservation and does not prove inbox delivery.

The deployed enquiry page exposes a nonempty Web3Forms public form identifier. Only the Web3Forms dashboard can confirm its destination inbox; the public business email does not change that destination. The owner must submit one real enquiry and confirm both the admin record and delivery to the intended mailbox (including spam).

Keep ordinary-plan Web3Forms submissions in the browser. Server-originated submissions require provider plan/IP arrangements; do not copy Bracketdex's proxy flow. See [Web3Forms troubleshooting](https://docs.web3forms.com/getting-started/troubleshooting).

## Owner/account actions still required

1. Supply the real address and service cities in Business settings. These remain blank; no location has been invented.
2. Confirm Web3Forms key ownership, destination mailbox and accepted-domain settings where available. Run a real enquiry after deployment and confirm mail receipt. `WEB3FORMS_ACCESS_KEY` is the supported variable.
3. Choose and configure the custom domain if desired. Confirm DNS, certificate, apex/www redirects and HTTPS before changing Business settings. No custom-domain or DNS changes were made in this audit.
4. Verify the current domain in Search Console and submit `/sitemap.xml`. HTML verification can use `GOOGLE_SITE_VERIFICATION`; no token has been supplied. Search indexing/ranking is not guaranteed by technical checks.
5. If analytics is wanted, implement a consent-controlled GA4 integration and provide a real measurement ID. Do not use a placeholder ID or copy a `/thank-you` page-view conversion: this site confirms inline. A conversion should fire only after the booking API returns a saved receipt, without contact/trip details in analytics.
6. Review the privacy text, hosting/Supabase/Web3Forms processing, retention and deletion process against the business's actual arrangements. No retention deadline or legal compliance certification is asserted.
7. Preview sharing in WhatsApp/LinkedIn after deployment; caches may retain an earlier card. Obtain permission and exact wording before adding customer testimonials.

## Operations and verification

Booking and login attempt limits are backed by the shared database (`attempts`), rather than only process memory. Host/provider controls remain relevant for sustained abuse. No new CAPTCHA was added.

Commands: `npm test`, `npm run typecheck`, `npm run build:vercel`, `npm run test:seo`, `npm run test:bookings`. SEO tests are read-only and accept `TEST_BASE_URL` for deployed verification. The booking integration suite uses local admin credentials and removes only its own synthetic fixture; it does not call Web3Forms.

Vercel distinguishes production/preview through [system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables). Environment changes require redeployment.
