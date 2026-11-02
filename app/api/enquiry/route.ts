import { env } from "@/lib/platform-env";
import { sameOrigin, limit, jsonBody } from "@/lib/auth";
import { validateEnquiry } from "@/lib/validation";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!env.WEB3FORMS_ACCESS_KEY)
    return Response.json(
      {
        error:
          "Online enquiries are not enabled yet. No enquiry has been sent.",
      },
      { status: 503 },
    );
  try {
    if (!(await limit(request, "enquiry", 5)))
      return Response.json(
        { error: "Please wait before sending another enquiry." },
        { status: 429 },
      );
    const raw = await jsonBody(request);
    if (raw.website)
      return Response.json({ error: "Unable to submit." }, { status: 400 });
    if (raw.consent !== true)
      throw new Error("Please agree to being contacted about this enquiry.");
    const data = validateEnquiry(raw);
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        access_key: env.WEB3FORMS_ACCESS_KEY,
        subject: "City2Trip travel enquiry",
        from_name: "City2Trip",
      }),
      signal: AbortSignal.timeout(15000),
    });
    const result = (await response.json()) as { success?: boolean };
    if (!response.ok || !result.success)
      throw new Error("Your enquiry could not be sent. Please try again.");
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof Error ? e.message : "Unable to send. Please try again.",
      },
      { status: 400 },
    );
  }
}
