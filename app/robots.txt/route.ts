import { readSettings } from "@/lib/repository";
import { robotsText } from "@/lib/seo-metadata";
import { env } from "@/lib/platform-env";
export async function GET() {
  const { domain } = await readSettings();
  return new Response(
    robotsText(domain, env.VERCEL_ENV),
    { headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" } },
  );
}
