import type { Settings } from "@/lib/validation";
import { siteOrigin } from "@/lib/seo-metadata";
export default function StructuredData({ settings }: { settings: Settings }) {
  const origin = siteOrigin(settings.domain);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": origin + "/#website",
        url: origin,
        name: "GosaviOn Group",
        description: "Local rides. Outstation journeys.",
      },
      {
        "@type": "Organization",
        "@id": origin + "/#organization",
        name: "GosaviOn Group",
        url: origin,
        ...(settings.phone ? { telephone: settings.phone } : {}),
        ...(settings.email ? { email: settings.email } : {}),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
