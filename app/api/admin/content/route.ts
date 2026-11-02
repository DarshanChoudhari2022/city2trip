import { guard, jsonBody } from "@/lib/auth";
import { saveItem } from "@/lib/repository";
export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    return Response.json(
      { item: await saveItem(await jsonBody(request)) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Unable to save." },
      { status: 400 },
    );
  }
}
