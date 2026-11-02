import { guard, COOKIE } from "@/lib/auth";
export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
      },
    },
  );
}
