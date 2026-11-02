import { readPublicContent, readSettings } from "@/lib/repository";
import { siteOrigin } from "@/lib/seo-metadata";
export async function GET() {
  const { domain } = await readSettings();
  const items = await readPublicContent();
  const paths = [
    "/",
    "/services",
    "/tours",
    "/contact",
    "/enquiry",
    "/privacy",
    ...items.map(
      (i) => "/" + (i.kind === "package" ? "tours" : "services") + "/" + i.slug,
    ),
  ];
  const origin = siteOrigin(domain);
  const urls = paths
        .map(
          (path) =>
            `<url><loc>${(origin + path).replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</loc></url>`,
        )
        .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store",
      },
    },
  );
}
