// Current public deployment; replace in Business settings when the custom domain is live.
const productionOrigin = "https://city2trip.vercel.app";

export function siteOrigin(domain: string) {
  try {
    const url = new URL(domain);
    if (url.protocol === "https:" && !url.username && !url.password &&
        url.pathname === "/" && !url.search && !url.hash) return url.origin;
  } catch { /* An unset domain uses the existing production site. */ }
  return productionOrigin;
}

export function publicMetadata(title: string, description: string, path: string, domain: string) {
  const origin = siteOrigin(domain);
  const image = origin + "/images/gosavion-share.png";
  return {
    title,
    description,
    alternates: { canonical: origin + path },
    openGraph: {
      title: title + " | GosaviOn Group",
      description,
      type: "website" as const,
      siteName: "GosaviOn Group",
      url: origin + path,
      images: [{ url: image, width: 1200, height: 630,
        alt: "GosaviOn Group — vehicle and chauffeur rental" }],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [image] },
  };
}

export function robotsText(domain: string, deployment?: string) {
  if (deployment && deployment !== "production") return "User-agent: *\nDisallow: /\n";
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${siteOrigin(domain)}/sitemap.xml\n`;
}
