import { env } from "@/lib/platform-env";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { defaultSettings } from "./seed";
import { brandContent } from "./brand";
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
  if (hasSupabaseConfig()) {
    const { data, error } = await supabase()
      .from("content")
      .select("payload")
      .order("position", { ascending: true });
    if (error) throw error;
    return brandContent(
      data.map((row) =>
        typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload,
      ) as ContentItem[],
    );
  }
  const result = await database()
    .prepare("SELECT payload FROM content ORDER BY rowid")
    .all<{ payload: string }>();
  return brandContent(result.results.map((r) => JSON.parse(r.payload)));
}
export async function readPublicContent() {
  return (await readAll()).filter((i) => isVisible(i));
}
export async function readSettings(): Promise<Settings> {
  if (hasSupabaseConfig()) {
    const { data, error } = await supabase()
      .from("settings")
      .select("payload")
      .eq("id", "business")
      .maybeSingle();
    if (error) throw error;
    const payload = data?.payload;
    return brandContent(
      payload
        ? {
            ...defaultSettings,
            ...(typeof payload === "string" ? JSON.parse(payload) : payload),
          }
        : defaultSettings,
    );
  }
  const row = await database()
    .prepare("SELECT payload FROM settings WHERE id = 'business'")
    .first<{ payload: string }>();
  return brandContent(
    row ? { ...defaultSettings, ...JSON.parse(row.payload) } : defaultSettings,
  );
}
export async function saveItem(raw: unknown) {
  const item = validateItem(raw);
  item.id ||= crypto.randomUUID();
  if (hasSupabaseConfig()) {
    const client = supabase();
    const { data: existing, error: lookupError } = await client
      .from("content")
      .select("id")
      .eq("slug", item.slug)
      .neq("id", item.id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) throw new Error("That URL slug is already in use.");
    const { error } = await client.from("content").upsert({
      id: item.id,
      slug: item.slug,
      kind: item.kind,
      payload: item,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    return item;
  }
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
  if (hasSupabaseConfig()) {
    const { error } = await supabase()
      .from("settings")
      .upsert({ id: "business", payload: settings });
    if (error) throw error;
    return settings;
  }
  await database()
    .prepare(
      "INSERT INTO settings(id,payload) VALUES('business',?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload",
    )
    .bind(JSON.stringify(settings))
    .run();
  return settings;
}
