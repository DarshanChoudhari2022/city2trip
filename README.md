# City2Trip

A responsive chauffeur-driven travel website with a protected, shared content editor. Built with React, TypeScript, Vinext, D1 and R2. The local preview is implemented; public hosting, final business content and Web3Forms delivery are not yet configured.

## Open and edit

Admin sign-in now requires username `admin` and the existing password. The username can be changed using `ADMIN_USERNAME` in the host environment. See `ADMIN.md` for the full nontechnical editor guide.

Submitted forms are saved privately under **Admin → Booking requests** before optional Web3Forms email delivery. The inbox includes complete trip/contact details, status filtering and pagination. It uses a dedicated `booking:<UUID>` namespace in the existing protected JSON document store; no additional database migration is required. Older email-only submissions are not imported automatically. Run `npm run test:bookings` against the local preview to verify storage, deduplication and private admin access; synthetic records created by that test are removed automatically.

- Start with `npm run dev -- --port 5173 --hostname 127.0.0.1` from this directory.
- Website: `http://127.0.0.1:5173/`.
- Content studio: `http://127.0.0.1:5173/admin`.
- The local-only administrator password is in `.admin-local.txt`. Do not share or commit it. On a fresh checkout, `npm run setup:admin` generates it and `.dev.vars`. It refuses to overwrite existing credentials.

In **Tour packages** or **Services**, choose **Edit** or **Add**. Edit the content, upload a JPG/PNG/WebP photo, and choose your starting price or leave it blank for a personalised quote. Use **Published on website** to publish or unpublish. Optional display dates use India time and include the end date. **Featured on homepage** controls the featured package list. **Sample itinerary** keeps illustrative content clearly labelled. Save changes to make them visible to all visitors; a draft cannot be reached through its public URL.

In **Business settings**, update contact details, operating cities, about text, seasonal homepage message, vehicle categories/capacities, and FAQs. Add only offerings you actually provide. Changes persist in the shared database, not browser storage. Do not put confidential information in uploaded images: image URLs are public assets even if the associated package is a draft.

## Fresh local setup

Requires Node 22.13+ and npm. Run these commands from `website` in sequence:

```text
npm ci
npm run setup:admin
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_light_blink.sql
node --experimental-strip-types scripts/seed-local.ts
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file .seed-local.sql
npm run dev -- --port 5173 --hostname 127.0.0.1
```

Apply each schema migration once to a fresh database; do not replay an applied migration. The seed uses `INSERT OR IGNORE` and does not overwrite edited content. Local D1/R2 state is under `.wrangler/state` and is not committed. Back it up if you want to retain local edits across machines; production has separate D1/R2 storage. The Pages are rendered dynamically so admin publications are read on the next public page request.

## Web3Forms booking requests

Set `WEB3FORMS_ACCESS_KEY` in Vercel and redeploy the updated code. The booking page passes this public form identifier to the browser, which submits directly to Web3Forms. This works with standard Web3Forms plans; the former server proxy is retired. Supabase credentials remain server-only. See `WEB3FORMS.md` for setup, fields, error states and delivery verification.

## Deploy to Vercel with Supabase

The Vercel build uses Vinext through Nitro and writes Vercel Build Output to `.vercel/output`; it does not use Next.js's `.next` manifest. In Vercel, set the project root to `website`, use the Other framework preset (or disable framework detection), and set the build command to `npm run build:vercel`. Leave the output directory at Nitro's `.vercel/output`.

Create a Supabase project and run `supabase/schema.sql` in its SQL editor. This creates the content, settings, and rate-limit tables, plus a private `city2trip-media` bucket. In Vercel Project Settings > Environment Variables, set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`, and `ADMIN_PASSWORD_HASH`. Set `SUPABASE_STORAGE_BUCKET` only if you chose a different bucket name. Add `WEB3FORMS_ACCESS_KEY` when enquiry delivery is ready. Keep the service-role key and all other secrets server-side; never use a `NEXT_PUBLIC_` prefix.

Generate the admin password hash and session secret with `npm run setup:admin` in a trusted local checkout, then copy those two values from `.dev.vars` into Vercel's environment settings. The command creates local credentials; do not deploy `.dev.vars` or use the local admin password. Once the variables and schema are in place, redeploy. Content is stored in Supabase and is not copied automatically from local D1.

## Before public launch

1. Review every service and package; replace sample travel ideas or unpublish them. Verify route, price, inclusions, vehicle capacity and season dates.
2. Add the real phone number, email, business address and operating cities. Review and complete the privacy notice and retention policy.
3. Configure a production administrator password verifier and a new random `SESSION_SECRET` of at least 32 characters. Use a separate local bootstrap directory or trusted secret provisioning flow; never reuse the bundled local credentials. Admin sessions expire after eight hours. Rotating the signing secret invalidates all sessions.
4. Deploy through Vercel using the Supabase setup above, or through Sites with the existing `DB`/`BUCKET` bindings and committed Drizzle migrations. Seed production deliberately with verified content; local data is not uploaded automatically.
5. Set the actual HTTPS website domain in Business settings. Until then, `robots.txt` disallows indexing and the sitemap has no URLs. With a domain configured, canonical URLs, social metadata, structured data and the public sitemap are generated. Admin and API routes remain excluded.
6. Connect and test Web3Forms, verify the public domain and mobile experience, then configure Google Business Profile and Search Console under the business owner's accounts. SEO foundations do not guarantee a ranking position.

## Verification

```text
npm test
npm run typecheck
npm run build
npm run test:integration
```

Integration tests require the local preview, local sample database and generated local administrator credential. They use synthetic test packages with IDs beginning `qa-` and leave them unpublished. Run on a development database only. They verify anonymous/forged/cross-origin writes fail, draft visibility, shared publish/unpublish, duplicate slugs, validation, unavailable enquiry delivery, SEO endpoints and unknown-page 404s. Actual email delivery must be tested after Web3Forms is connected.

Image sources and the generated hero prompt are in `ASSETS.md`. The approved design and execution plan are under `../docs/superpowers/`.

---

## Bundled runtime reference

A clean full-stack starter running on [vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`
- Portable: Windows, macOS, or Linux; no Bash required
- Managed Linux: managed Linux runtime with Bash, `flock`, `curl`, `sha256sum`, and GNU `timeout`
- Git and `tar` (including Windows `tar.exe`) are required for publishing; portable publication does not require Bash

## Sites Lifecycle

The Sites initializer copies the shared starter and selects managed-linux only when `SITES_MANAGED_LINUX_CONTAINER=1`; otherwise it selects portable. It saves the selection only in ignored `.sites-runtime/execution-profile.json`. Both profiles copy/configure first, then use the plugin's separate `install-dependencies.mjs` step to measure installation independently. Edit source under `app/` and follow the Sites skill for installation, preview, builds, and publishing.

Run `node <plugin-root>/scripts/configure-execution-profile.mjs` only when the profile is unknown for the current checkout and environment. Profile changes do not alter tracked source or require reinstalling otherwise-valid dependencies; restart an existing preview to use the new selection. Do not commit or upload `.sites-runtime/`.

This starter does not use `wrangler.jsonc`.

Publish archives outside the source checkout or under its ignored `outputs/` directory. Local `.env*`, `.dev.vars*`, TypeScript build state, and tool runtime directories are ignored; keep the hosting manifest, migrations, and authored scripts in source control.

`install:ci` runs `npm ci` once against the shared lockfile, disables parent-workspace discovery, and includes required dev/optional dependencies despite production/omit settings. Sharp defaults to prebuilt binaries unless explicitly configured otherwise. Do not overlap installers.

- **Portable:** Preserve host HOME, npm cache, registry, proxy, temporary paths, retry/concurrency settings, and lifecycle-script policy. Use `--prefer-offline --no-audit --no-fund`.
- **Managed Linux:** Use the existing project-local HOME/cache/tmp setup and Linux install lock, tarball preflight, and timeout. Restore the image-seeded npm cache only when its lockfile hash matches; retain network fallback. Builds keep their existing timeout. These helpers are not invoked by the portable profile.

`scripts/sites-env.mjs` preserves the caller's HOME, npm cache, proxy, XDG, and temporary-directory configuration while defaulting Wrangler and Miniflare state to the checkout. If npm reports an unwritable cache, select a writable path with `npm_config_cache` for that install. The `dev` and `start` scripts also keep Wrangler logs inside the checkout. Generated `.sites-runtime/` and `.wrangler/` directories are disposable and ignored by Git.

On portable, `npm run dev` uses `vinext dev` with HMR, starting at port 5173. Vinext records the running server in ignored `.vinext/` state, rejects an ordinary duplicate launch, and recovers stale state after a stopped process; exactly simultaneous starts can race. Pass `--port <port>` or `--hostname <host>` after `npm run dev --` when needed; keep portable previews on loopback.

For managed Linux browser QA, follow the Sites skill's managed preview reference. The daemon runs the project's Vite dev script with `--host 0.0.0.0 --port 4173 --strictPort`; use the CLI's returned URL. The ignored local profile survives the daemon's cleared environment.

The portable profile simulates ChatGPT sign-in only for loopback development requests. Visit `/signin-with-chatgpt?return_to=/` to sign in as `local_seedy` (`seedy@sites.test`, display name `Seedy`) and `/signout-with-chatgpt?return_to=/` to sign out. The development cookie preserves that identity across server restarts. Mock auth is disabled in the managed-linux profile and is not included in production builds; hosted authentication remains dispatch-owned.

The Worker uses `vinext/server/fetch-handler`, including Vinext's config-aware image handling. After building, `npm start` runs that Worker locally through Wrangler on `127.0.0.1`, sharing `.wrangler/state` with dev preview and local D1 migrations; it does not deploy the site or simulate sign-in. Use the URL printed by the server. Pass `npm start -- --port <port>` to select a different built-preview port.

Local previews use Miniflare's placeholder `Request.cf` metadata without a network lookup. Set `CLOUDFLARE_CF_FETCH_ENABLED=true` to opt into fetching preview metadata; this setting does not change hosted request metadata.

Local tool usage metrics are disabled by default. Set `WRANGLER_SEND_METRICS=true` to opt in.

## Included Shape

- edit site code under `app/`
- `app/chatgpt-auth.ts` provides optional dispatch-owned ChatGPT sign-in helpers
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `worker/index.ts` is the production Worker entrypoint and preserves request-scoped connector bindings
- `scripts/vite/` contains the maintained Vite integrations and the vendored Sites plugin license
- `scripts/connector-preview/` contains the local connector preview Worker and session helpers
- the remaining `scripts/` files select execution profiles and run installation, development, and builds; the plugin's helpers orchestrate the Sites lifecycle
- `dist/` contains generated deployment output; `.vinext/`, `.wrangler/`, and `.sites-runtime/` contain ignored local tool state
- `db/index.ts` reads the D1 binding from the Cloudflare Worker environment
- `db/schema.ts` starts intentionally empty
- `@cloudflare/workers-types` provides Worker types; `cloudflare-env.d.ts` declares optional `DB`/`BUCKET` bindings—update these declarations if binding names change
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Use it as the durable user key; use email and name for display or contact purposes.

SIWC-authenticated workspace sites may also receive `oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty `name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by `oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use the returned `userId` as the stable user key for user-owned records; do not use email as a durable identifier.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send anonymous visitors through Sign in with ChatGPT.
- In a Server Component, start sign-in with `<a href={chatGPTSignInPath(returnTo)} target="_top">`. The auth helper module is server-only; do not import it into a Client Component.
- Do not use `fetch`, XHR, a client-side router, or a framework link that can prefetch the sign-in route. SIWC must start as a top-level navigation.
- Never request the AuthAPI authorization endpoint directly. The dispatch-owned `/signin-with-chatgpt` route must start the SIWC flow.
- Use `chatGPTSignOutPath(returnTo)` for browser sign-out links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the OAuth cookies, and identity header injection. Do not implement app routes for those reserved paths. Routes that do not import and call the helper remain anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the Sites hosting platform's access policy controls for workspace-wide restrictions, or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write actions tied to the current ChatGPT user. Leave public content anonymous.

## Local D1 migrations

For a D1-backed local preview, generate SQL with `npm run db:generate`. Build once through the Sites skill's build entrypoint (or `npm run build` for standalone use) to generate `dist/server/wrangler.json`, rebuilding if bindings change. From the project root, apply each pending migration in order:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_example.sql
```

Replace the filename with the pending migration and `DB` with your D1 binding name if different. Use `.wrangler/state`, not `.wrangler/state/v3`; Wrangler adds the versioned directories. Do not replay migrations already applied locally. This updates only the preview database; publishing applies production migrations separately.

## Diagnostic Commands

- `npm run install:ci`: perform the one locked dependency install
- `npm run dev`: start the Vite/Vinext development server
- `npm run build`: build the deployable Sites artifact
- `npm run start`: preview the built Worker locally with D1/R2 support
- `npm run db:generate`: generate Drizzle migrations after schema changes

When using the Sites plugin, follow its skill instructions for installation, builds, and publishing. These npm commands remain available for standalone use.

The portable build runs Vinext directly without a host `timeout` command. The managed-linux build uses `scripts/build-verified.sh` and its existing `SITES_BUILD_TIMEOUT` setting.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
