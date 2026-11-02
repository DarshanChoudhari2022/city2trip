import { env } from "@/lib/platform-env";
import { sameOrigin } from "@/lib/auth";
/** Retired proxy: ordinary Web3Forms plans submit from the visitor's browser. */
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  return Response.json(
    {
      error: env.WEB3FORMS_ACCESS_KEY?.trim()
        ? "Please use the booking form to send your request. No request has been sent."
        : "Online enquiries are not enabled yet. No enquiry has been sent.",
    },
    { status: env.WEB3FORMS_ACCESS_KEY?.trim() ? 410 : 503 },
  );
}
