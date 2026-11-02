import { readSettings } from "./repository";
export async function pageMetadata(
  title: string,
  description: string,
  path: string,
) {
  const { domain } = await readSettings();
  return {
    title,
    description,
    alternates: domain ? { canonical: domain + path } : undefined,
    openGraph: {
      title: title + " | GosaviOn Group",
      description,
      type: "website",
      siteName: "GosaviOn Group",
      ...(domain
        ? {
            url: domain + path,
            images: [
              {
                url: domain + "/images/vehicle.webp",
                width: 1536,
                height: 1024,
                alt: "GosaviOn Group scenic road journey",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      ...(domain ? { images: [domain + "/images/vehicle.webp"] } : {}),
    },
  };
}
