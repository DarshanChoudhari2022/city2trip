import { sameOrigin, jsonBody, limit } from "@/lib/auth";
import { bookingRecord } from "@/lib/booking-record";
import { storeBooking, BookingConflictError } from "@/lib/booking-store";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  let record;
  try {
    const raw = await jsonBody(request);
    record = bookingRecord(raw, raw?.submissionId);
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof Error ? e.message : "Please check the booking details.",
      },
      { status: 400 },
    );
  }
  try {
    if (!(await limit(request, "booking-create", 5)))
      return Response.json(
        {
          error: "Too many requests. Please wait a few minutes and try again.",
        },
        { status: 429 },
      );
    const receipt = await storeBooking(record);
    return Response.json(receipt, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof BookingConflictError)
      return Response.json(
        { error: error.message },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    return Response.json(
      {
        error:
          "Your booking request could not be saved. Please try again shortly.",
      },
      { status: 503 },
    );
  }
}
