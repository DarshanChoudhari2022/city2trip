import { env } from "@/lib/platform-env";
import { hasSupabaseConfig, storageBucket, supabase } from "@/lib/supabase";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(key))
    return new Response("Not found", { status: 404 });
  let body: BodyInit | null;
  let contentType: string | undefined;
  if (hasSupabaseConfig()) {
    const { data, error } = await supabase()
      .storage.from(storageBucket())
      .download(key);
    if (error || !data) return new Response("Not found", { status: 404 });
    body = data;
    contentType = data.type;
  } else {
    const object = await env.BUCKET?.get(key);
    if (!object) return new Response("Not found", { status: 404 });
    body = object.body;
    contentType = object.httpMetadata?.contentType;
  }
  return new Response(body, {
    headers: {
      "Content-Type": contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
