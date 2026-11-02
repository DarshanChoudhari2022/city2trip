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
      title: title + " | City2Trip",
      description,
      type: "website",
      siteName: "City2Trip",
      ...(domain
        ? {
            url: domain + path,
            images: [
              {
                url: domain + "/images/hero.webp",
                width: 1536,
                height: 1024,
                alt: "City2Trip scenic road journey",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      ...(domain ? { images: [domain + "/images/hero.webp"] } : {}),
    },
  };
}
