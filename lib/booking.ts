import { validateEnquiry } from "./validation.ts";
/** Web3Forms access keys are public form identifiers, never database credentials. */
export async function submitBooking(
  input: Record<string, unknown>,
  accessKey: string,
  send: typeof fetch = fetch,
  reference?: string,
): Promise<void> {
  if (!accessKey.trim())
    throw new Error(
      "Online booking requests are not enabled yet. No request has been sent.",
    );
  if (input.website)
    throw new Error("Unable to send this request. Please try again.");
  if (input.consent !== true)
    throw new Error(
      "Please agree to being contacted about this booking request.",
    );
  const details = validateEnquiry(input);
  let response: Response;
  try {
    response = await send("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...details,
        ...(reference ? { booking_reference: reference } : {}),
        access_key: accessKey.trim(),
        subject: `GosaviOn Group booking request — ${details.service}`,
        from_name: "GosaviOn Group bookings",
        timezone: "Asia/Kolkata",
        botcheck: false,
        consent: "Agreed to contact about this booking request",
      }),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      "Unable to send your request. Check your connection and try again.",
    );
  }
  if (response.status === 429)
    throw new Error(
      "Too many requests. Please wait a few minutes and try again.",
    );
  let result: { success?: boolean };
  try {
    result = (await response.json()) as { success?: boolean };
  } catch {
    throw new Error(
      "The booking service is temporarily unavailable. Please try again.",
    );
  }
  if (!response.ok || result?.success !== true)
    throw new Error(
      "Your booking request could not be sent. Please try again or contact our team.",
    );
}
