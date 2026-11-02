# Booking requests through Web3Forms

In Vercel → Project Settings → Environment Variables, set `WEB3FORMS_ACCESS_KEY` to the access key from Web3Forms. Choose Production and any Preview environments you use, then redeploy the updated source. Existing deployments do not pick up changed environment variables automatically.

The server-rendered enquiry page passes only this public form identifier to the booking component. It never passes Supabase credentials. Web3Forms access keys are intended for public forms; normal plans submit directly from the visitor’s browser to `https://api.web3forms.com/submit`. Server-side submission requires a paid Web3Forms plan and whitelisted server IPs, so this application does not use a server proxy for delivery.

The booking email includes service/package, pickup, destination, travel date, pickup time in India, optional return date, passenger count, name, phone, optional reply-to email, message and consent. The inbox is the one linked to the access key in Web3Forms. A honeypot and provider spam filtering protect the public form. Database login rate limits remain for the admin; booking delivery does not depend on the content database rate-limit function.

The UI validates required fields and trip dates, prevents duplicate clicks while sending, and waits for both a successful HTTP response and `success: true` before showing confirmation. Provider rejection, rate limits, timeouts and network errors preserve the entered details and allow retry. Confirmation means a booking request was sent; the business still confirms the reservation separately.

For local testing add the same variable to `.dev.vars` (Cloudflare preview) or `.env.local` (Node/Vercel preview), then restart the preview. Local preview remains unavailable without that key, even if it is set on Vercel. Never use your Supabase service-role key as a Web3Forms key.

Tests use a simulated provider transport and do not send actual emails. After deployment, submit a test request in the live browser and confirm it arrives in the destination inbox. If Web3Forms domain restrictions are enabled, allow the actual custom/Vercel domain there. This session has not verified live inbox delivery because the key was supplied only in Vercel.

Provider reference: https://docs.web3forms.com/getting-started/api-reference
