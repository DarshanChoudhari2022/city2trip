import { readSettings } from "@/lib/repository";
export async function GET() {
  const { domain } = await readSettings();
  return new Response(
    domain
      ? `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${domain}/sitemap.xml\n`
      : "User-agent: *\nDisallow: /\n",
    { headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" } },
  );
}
