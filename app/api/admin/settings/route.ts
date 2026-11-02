import { guard, jsonBody } from "@/lib/auth";
import { saveSettings } from "@/lib/repository";
export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    return Response.json({
      settings: await saveSettings(await jsonBody(request)),
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Unable to save." },
      { status: 400 },
    );
  }
}
