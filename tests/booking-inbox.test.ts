import test from "node:test";
import assert from "node:assert/strict";
import { bookingRecord, bookingStatus } from "../lib/booking-record.ts";
import { receiveBooking } from "../lib/booking-request.ts";
const id = "2d55cfbb-84b0-46aa-a27f-84c74ea858f9";
const input = {
  name: "Test Customer",
  phone: "9876543210",
  email: "test@example.com",
  pickup: "Pune",
  destination: "Mumbai",
  date: "2099-12-20",
  time: "10:00",
  returnDate: "",
  passengers: "3",
  vehicle: "Baleno manual",
  service: "Hire a driver for your car",
  message: "One day trip",
  consent: true,
  website: "",
};
test("creates a private booking record with every validated field", () => {
  const record = bookingRecord(input, id);
  assert.equal(record.id, id);
  assert.equal(record.status, "new");
  assert.equal(record.details.name, input.name);
  assert.equal(record.details.vehicle, input.vehicle);
  assert.equal(record.details.phone, input.phone);
  assert.ok(record.reference.startsWith("GOG-"));
  assert.ok(record.createdAt);
  assert.equal("access_key" in record.details, false);
});
test("rejects spoofed statuses, malformed IDs and unconsented entries", () => {
  assert.throws(() => bookingRecord({ ...input, consent: false }, id));
  assert.throws(() => bookingRecord(input, "../business"));
  assert.throws(() => bookingStatus("published"));
  assert.equal(bookingStatus("contacted"), "contacted");
  assert.equal(
    bookingRecord({ ...input, status: "confirmed" }, id).status,
    "new",
  );
});
test("saves before emailing and includes the saved reference in notification", async () => {
  const calls: string[] = [];
  const send: typeof fetch = async (url, options) => {
    calls.push(String(url));
    const payload = JSON.parse(options!.body as string);
    if (url === "/api/bookings") {
      assert.equal(payload.submissionId, id);
      assert.equal(payload.name, input.name);
      return Response.json({ reference: "GOG-TEST", id });
    }
    assert.equal(payload.booking_reference, "GOG-TEST");
    return Response.json({ success: true });
  };
  const result = await receiveBooking(input, "public-key", id, send);
  assert.deepEqual(calls, [
    "/api/bookings",
    "https://api.web3forms.com/submit",
  ]);
  assert.equal(result.reference, "GOG-TEST");
  assert.equal(result.emailSent, true);
});
test("database failure never sends email or reports acceptance", async () => {
  const calls: string[] = [];
  await assert.rejects(
    receiveBooking(input, "key", id, async (url) => {
      calls.push(String(url));
      return Response.json({ error: "Storage unavailable" }, { status: 503 });
    }),
  );
  assert.deepEqual(calls, ["/api/bookings"]);
});
test("email failure or missing key cannot lose a saved request", async () => {
  const result = await receiveBooking(input, "key", id, async (url) =>
    url === "/api/bookings"
      ? Response.json({ reference: "GOG-TEST", id })
      : Response.json({ success: false }, { status: 500 }),
  );
  assert.equal(result.reference, "GOG-TEST");
  assert.equal(result.emailSent, false);
  let calls = 0;
  const noKey = await receiveBooking(input, "", id, async () => {
    calls++;
    return Response.json({ reference: "GOG-TEST", id });
  });
  assert.equal(calls, 1);
  assert.equal(noKey.reference, "GOG-TEST");
});
