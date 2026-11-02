import { env } from "cloudflare:workers";
import { COOKIE, sameOrigin, limit, jsonBody } from "@/lib/auth";
import { checkPassword, signSession } from "@/lib/security";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (
    !env.ADMIN_PASSWORD_HASH ||
    !env.SESSION_SECRET ||
    env.SESSION_SECRET.length < 32
  )
    return Response.json(
      { error: "Admin access has not been configured." },
      { status: 503 },
    );
  if (!(await limit(request, "login", 8)))
    return Response.json(
      { error: "Too many attempts. Please try again in 15 minutes." },
      { status: 429 },
    );
  try {
    const { password } = await jsonBody(request);
    if (
      typeof password !== "string" ||
      password.length > 256 ||
      !(await checkPassword(password, env.ADMIN_PASSWORD_HASH))
    )
      return Response.json({ error: "Incorrect password." }, { status: 401 });
    const token = await signSession(env.SESSION_SECRET);
    return Response.json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`,
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "Unable to sign in. Please try again." },
      { status: 400 },
    );
  }
}
