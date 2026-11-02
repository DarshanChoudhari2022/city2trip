# Booking requests through Web3Forms

In Vercel → Project Settings → Environment Variables, set `WEB3FORMS_ACCESS_KEY` to the access key from Web3Forms. Choose Production and any Preview environments you use, then redeploy the updated source. Existing deployments do not pick up changed environment variables automatically.

The server-rendered enquiry page passes only this public form identifier to the booking component. It never passes Supabase credentials. Web3Forms access keys are intended for public forms; normal plans submit directly from the visitor’s browser to `https://api.web3forms.com/submit`. Server-side submission requires a paid Web3Forms plan and whitelisted server IPs, so this application does not use a server proxy for delivery.

The booking email includes service/package, pickup, destination, travel date, pickup time in India, optional return date, passenger count, name, phone, optional reply-to email, message and consent. The inbox is the one linked to the access key in Web3Forms. A honeypot and provider spam filtering protect the public form. Server-side rate limits protect booking creation as well as admin login.

The form first saves a validated private booking request through `/api/bookings`, using a stable submission ID to avoid duplicate records on retry. Only after storage succeeds is Web3Forms attempted. The email includes the saved booking reference. If storage fails, the visitor sees an error and no email is sent. If email fails or the access key is missing, the saved booking still appears under Admin → Booking requests and the visitor receives its reference. Provider success means email was accepted; it is not a delivery receipt. The business confirms the reservation separately.

For local testing add the same variable to `.dev.vars` (Cloudflare preview) or `.env.local` (Node/Vercel preview), then restart the preview. The local form still saves to admin without that key; only email notifications are skipped. Never use your Supabase service-role key as a Web3Forms key.

Tests use a simulated provider transport and do not send actual emails. After deployment, submit a test request in the live browser and confirm it arrives in the destination inbox. If Web3Forms domain restrictions are enabled, allow the actual custom/Vercel domain there. This session has not verified live inbox delivery because the key was supplied only in Vercel.

Provider reference: https://docs.web3forms.com/getting-started/api-reference

## Private storage

Booking documents use `booking:<UUID>` keys in the existing RLS-protected `settings` document table. The public business settings reader selects only `id=business`; booking list/update endpoints require server-side admin authentication. No new SQL migration is needed for the existing Supabase/D1 installation. Older email-only submissions are not retroactively imported.
