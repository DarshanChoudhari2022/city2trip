import { readSettings } from "./repository";
import { publicMetadata } from "./seo-metadata";
export async function pageMetadata(
  title: string,
  description: string,
  path: string,
) {
  const { domain } = await readSettings();
  return publicMetadata(title, description, path, domain);
}
