# Vercel + Supabase

Admin sign-in requires username `admin` and the existing password. `ADMIN_USERNAME` is optional and defaults to `admin`; no environment change is required to use that default. Deploy the updated source to activate the username field.

1. In Supabase SQL Editor, run `supabase/setup.sql` once. This creates the shared content/settings tables, rate-limit function, row-level security and private `city2trip-media` image bucket, and inserts sample content without replacing existing records.
2. In Vercel Project Settings, set Root Directory to `website`, Framework Preset to Other and Build Command to `npm run build:vercel`. The tracked `vercel.json` configures the build; Nitro produces Vercel Build Output under `.vercel/output`. Keep Output Directory at its default.
3. In Settings → Environment Variables, import the contents of the local ignored `.vercel.env.local` file. Select Production and, if desired, Preview. It contains `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` and `CITY2TRIP_DEPLOY_TARGET`.
4. Deploy the updated source. Environment changes require a new deployment. The current local Vercel build passes; the remote deployment has not been inspected.
5. Open `/admin` on your Vercel domain. Its separately generated password is in the ignored `.admin-vercel.txt` file. Add real business content and the live domain in Business settings.

The anon and publishable keys are unnecessary for this implementation: database and storage access runs on the server after application permission checks. Never prefix the service-role key with `NEXT_PUBLIC_` or `VITE_`. Replace it in both local environment files and Vercel when rotating it. Do not commit the actual environment import file or administrator password file.

Local credentials are saved in `.dev.vars` for the Cloudflare preview and `.env.local` for Node/Vercel-mode previews. Both now point to the supplied Supabase project. Database-backed pages require running the SQL first.

Set `WEB3FORMS_ACCESS_KEY` to activate booking requests, redeploy the updated code and test inbox delivery. Only the Web3Forms public form identifier is passed to the browser; Supabase credentials remain server-only. See `WEB3FORMS.md`.
