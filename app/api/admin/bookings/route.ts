import { isAdmin, guard, jsonBody } from "@/lib/auth";
import { bookingStatus } from "@/lib/booking-record";
import { listBookings, updateBooking } from "@/lib/booking-store";
export async function GET(request: Request) {
  if (!(await isAdmin()))
    return Response.json(
      { error: "Please sign in again." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  const url = new URL(request.url);
  let status;
  const offset = Number(url.searchParams.get("offset") || 0);
  if (!Number.isInteger(offset) || offset < 0 || offset > 1000000)
    return Response.json({ error: "Invalid page." }, { status: 400 });
  try {
    if (url.searchParams.get("status"))
      status = bookingStatus(url.searchParams.get("status"));
  } catch {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }
  try {
    return Response.json(await listBookings(offset, status), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "Unable to load booking requests. Please try again." },
      { status: 503 },
    );
  }
}
export async function PATCH(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const raw = await jsonBody(request);
    const record = await updateBooking(raw.id, raw.status);
    if (!record)
      return Response.json(
        { error: "Booking request not found." },
        { status: 404 },
      );
    return Response.json(
      { item: record },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof Error && /valid|Choose/.test(e.message)
            ? e.message
            : "Unable to update this booking request.",
      },
      { status: 400 },
    );
  }
}
