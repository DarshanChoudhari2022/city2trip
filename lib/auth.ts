import { env } from "@/lib/platform-env";
import { cookies } from "next/headers";
import { verifySession } from "./security";
import { database } from "./repository";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
export const COOKIE = "city2trip_admin";
export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  return !!(
    token &&
    env.SESSION_SECRET &&
    (await verifySession(token, env.SESSION_SECRET))
  );
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
export async function guard(request: Request) {
  if (!sameOrigin(request))
    return Response.json(
      { error: "Cross-origin requests are not allowed." },
      { status: 403 },
    );
  if (!(await isAdmin()))
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  return null;
}
export async function limit(request: Request, scope: string, max: number) {
  const ip = request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "local";
  const key = scope + ":" + ip + ":" + Math.floor(Date.now() / 900000);
  if (hasSupabaseConfig()) {
    const { data, error } = await supabase().rpc("increment_attempt", {
      attempt_id: key,
      expires_at: Date.now() + 900000,
    });
    if (error) throw error;
    return Number(data) <= max;
  }
  const result = await database()
    .prepare(
      "INSERT INTO attempts(id,count,expires) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 RETURNING count",
    )
    .bind(key, Date.now() + 900000)
    .first<{ count: number }>();
  await database()
    .prepare("DELETE FROM attempts WHERE expires < ?")
    .bind(Date.now())
    .run();
  return (result?.count ?? max + 1) <= max;
}
export async function jsonBody(request: Request) {
  const body = await request.text();
  if (body.length > 60000) throw new Error("Request is too large.");
  return JSON.parse(body);
}
