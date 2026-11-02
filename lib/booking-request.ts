import { bookingRecord } from "./booking-record.ts";
import { submitBooking } from "./booking.ts";
export async function receiveBooking(
  input: Record<string, unknown>,
  accessKey: string,
  submissionId: string,
  send: typeof fetch = fetch,
): Promise<{ reference: string; emailSent: boolean }> {
  bookingRecord(input, submissionId);
  let response: Response;
  try {
    response = await send("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, submissionId }),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      "Unable to save your booking request. Check your connection and try again.",
    );
  }
  let result: { reference?: string; error?: string };
  try {
    result = (await response.json()) as { reference?: string; error?: string };
  } catch {
    throw new Error(
      "Your booking request could not be saved. Please try again.",
    );
  }
  if (!response.ok || typeof result.reference !== "string" || !result.reference)
    throw new Error(
      result.error ||
        "Your booking request could not be saved. Please try again.",
    );
  if (!accessKey.trim())
    return { reference: result.reference, emailSent: false };
  try {
    await submitBooking(input, accessKey, send, result.reference);
    return { reference: result.reference, emailSent: true };
  } catch {
    return { reference: result.reference, emailSent: false };
  }
}
