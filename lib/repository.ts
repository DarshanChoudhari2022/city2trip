import { env } from "cloudflare:workers";
import { defaultSettings } from "./seed";
import {
  isVisible,
  validateItem,
  validateSettings,
  type ContentItem,
  type Settings,
} from "./validation";
export function database() {
  if (!env.DB) throw new Error("Database is not configured.");
  return env.DB;
}
export async function readAll(): Promise<ContentItem[]> {
  const result = await database()
    .prepare("SELECT payload FROM content ORDER BY rowid")
    .all<{ payload: string }>();
  return result.results.map((r) => JSON.parse(r.payload));
}
export async function readPublicContent() {
  return (await readAll()).filter((i) => isVisible(i));
}
export async function readSettings(): Promise<Settings> {
  const row = await database()
    .prepare("SELECT payload FROM settings WHERE id = 'business'")
    .first<{ payload: string }>();
  return row
    ? { ...defaultSettings, ...JSON.parse(row.payload) }
    : defaultSettings;
}
export async function saveItem(raw: unknown) {
  const item = validateItem(raw);
  item.id ||= crypto.randomUUID();
  const exists = await database()
    .prepare("SELECT id FROM content WHERE slug = ? AND id != ?")
    .bind(item.slug, item.id)
    .first();
  if (exists) throw new Error("That URL slug is already in use.");
  await database()
    .prepare(
      "INSERT INTO content(id,slug,kind,payload,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,kind=excluded.kind,payload=excluded.payload,updated_at=excluded.updated_at",
    )
    .bind(
      item.id,
      item.slug,
      item.kind,
      JSON.stringify(item),
      new Date().toISOString(),
    )
    .run();
  return item;
}
export async function saveSettings(raw: unknown) {
  const settings = validateSettings(raw);
  await database()
    .prepare(
      "INSERT INTO settings(id,payload) VALUES('business',?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload",
    )
    .bind(JSON.stringify(settings))
    .run();
  return settings;
}
