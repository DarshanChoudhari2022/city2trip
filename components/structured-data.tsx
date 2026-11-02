import type { Settings } from "@/lib/validation";
export default function StructuredData({ settings }: { settings: Settings }) {
  if (!settings.domain) return null;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": settings.domain + "/#website",
        url: settings.domain,
        name: "GosaviOn Group",
        description: "Local rides. Outstation journeys.",
      },
      {
        "@type": "Organization",
        "@id": settings.domain + "/#organization",
        name: "GosaviOn Group",
        url: settings.domain,
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
