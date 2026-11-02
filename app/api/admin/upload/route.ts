import { env } from "@/lib/platform-env";
import { guard } from "@/lib/auth";
import { hasSupabaseConfig, storageBucket, supabase } from "@/lib/supabase";
export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  if (!hasSupabaseConfig() && !env.BUCKET)
    return Response.json(
      { error: "Image storage is not configured." },
      { status: 503 },
    );
  try {
    if (Number(request.headers.get("content-length")) > 5_500_000)
      throw new Error("Maximum image size is 5 MB.");
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File) || file.size > 5_000_000)
      throw new Error("Choose an image smaller than 5 MB.");
    const data = await file.arrayBuffer();
    const b = new Uint8Array(data);
    let ext = "";
    if (b[0] === 255 && b[1] === 216 && b[2] === 255) ext = "jpg";
    else if (b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71)
      ext = "png";
    else if (
      new TextDecoder().decode(b.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(b.slice(8, 12)) === "WEBP"
    )
      ext = "webp";
    if (!ext) throw new Error("Use a JPG, PNG or WebP image.");
    const key = crypto.randomUUID() + "." + ext;
    const contentType = ext === "jpg" ? "image/jpeg" : "image/" + ext;
    if (hasSupabaseConfig()) {
      const { error } = await supabase()
        .storage.from(storageBucket())
        .upload(key, data, { contentType, upsert: false });
      if (error) throw error;
    } else {
      await env.BUCKET!.put(key, data, { httpMetadata: { contentType } });
    }
    return Response.json({ url: "/api/media/" + key });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 400 },
    );
  }
}
