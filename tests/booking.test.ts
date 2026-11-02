import test from "node:test";
import assert from "node:assert/strict";
import { submitBooking } from "../lib/booking.ts";
const booking = {
  vehicle: "Maruti Baleno — manual",
  name: "Test Traveller",
  phone: "9876543210",
  email: "traveller@example.com",
  pickup: "Pune airport",
  destination: "Mumbai",
  date: "2099-12-20",
  time: "10:00",
  passengers: "3",
  service: "Airport transfer",
  returnDate: "",
  message: "Two suitcases",
  consent: true,
  website: "",
};
test("sends validated trip details directly to Web3Forms", async () => {
  let calls = 0;
  const send: typeof fetch = async (url, options) => {
    calls++;
    assert.equal(url, "https://api.web3forms.com/submit");
    const body = JSON.parse(options!.body as string);
    assert.equal(body.access_key, "test-access-key");
    assert.equal(body.pickup, "Pune airport");
    assert.equal(body.vehicle, booking.vehicle);
    assert.equal(body.destination, "Mumbai");
    assert.equal(body.timezone, "Asia/Kolkata");
    assert.equal(body.email, booking.email);
    assert.equal(body.botcheck, false);
    assert.match(body.subject, /GosaviOn/);
    assert.equal(body.consent, "Agreed to contact about this booking request");
    return Response.json({ success: true });
  };
  await submitBooking(booking, "test-access-key", send);
  assert.equal(calls, 1);
});
test("does not send missing-key, invalid or honeypot-filled requests", async () => {
  let calls = 0;
  const send: typeof fetch = async () => {
    calls++;
    return Response.json({ success: true });
  };
  await assert.rejects(submitBooking(booking, "", send));
  await assert.rejects(
    submitBooking({ ...booking, phone: "123" }, "key", send),
  );
  await assert.rejects(
    submitBooking({ ...booking, website: "spam" }, "key", send),
  );
  await assert.rejects(
    submitBooking({ ...booking, consent: false }, "key", send),
  );
  assert.equal(calls, 0);
});
test("never reports success for provider rejection, rate limit or malformed response", async () => {
  for (const response of [
    Response.json({ success: false }, { status: 200 }),
    Response.json({ success: true }, { status: 429 }),
    new Response("<html>error</html>", { status: 500 }),
  ]) {
    const send: typeof fetch = async () => response;
    await assert.rejects(submitBooking(booking, "key", send));
  }
});
test("network failures keep the booking unsent", async () => {
  await assert.rejects(
    submitBooking(booking, "key", async () => {
      throw new TypeError("Failed to fetch");
    }),
    /connection|send|try/i,
  );
});
