import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const testIp='qa-inbox-'+crypto.randomUUID();
const send = (path, body, cookie, method = "POST", origin = base) =>
  fetch(base + path, {
    method,
    headers: {
      Origin: origin,
      'X-Real-IP':testIp,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
test("booking persistence, idempotency, private access and admin statuses", async () => {
  const id = crypto.randomUUID(),
    name = "QA Inbox " + id.slice(0, 8);
  let cookie = "";
  const input = {
    submissionId: id,
    name,
    phone: "9999999999",
    email: "test@example.com",
    pickup: "QA pickup",
    destination: "QA destination",
    date: "2099-12-20",
    time: "10:00",
    returnDate: "",
    passengers: "2",
    vehicle: "QA car, manual",
    service: "Hire a driver for your car",
    message: "Synthetic test record — removed after verification.",
    consent: true,
    website: "",
    status: "confirmed",
  };
  try {
    assert.equal((await fetch(base + "/api/admin/bookings")).status, 401);
    assert.equal(
      (
        await send(
          "/api/admin/bookings",
          { id, status: "confirmed" },
          undefined,
          "PATCH",
        )
      ).status,
      401,
    );
    assert.equal(
      (
        await send(
          "/api/bookings",
          input,
          undefined,
          "POST",
          "https://other.example",
        )
      ).status,
      403,
    );
    assert.equal(
      (await send("/api/bookings", { ...input, passengers: "0" })).status,
      400,
    );
    const response = await send("/api/bookings", input);
    assert.equal(response.status, 201);
    const receipt = await response.json();
    assert.equal(receipt.id, id);
    assert.match(receipt.reference, /^GOG-/);
    assert.equal("details" in receipt, false);
    const duplicate = await send("/api/bookings", input);
    assert.equal(duplicate.status, 201);
    assert.equal((await duplicate.json()).reference, receipt.reference);
    const conflict = await send("/api/bookings", {
      ...input,
      name: "Spoofed replacement",
    });
    assert.equal(conflict.status, 409);
    const password = readFileSync(".admin-local.txt", "utf8")
      .split("\n")[2]
      .trim();
    const login = await send("/api/admin/login", {
      username: "admin",
      password,
    });
    assert.equal(login.status, 200);
    cookie = login.headers.get("set-cookie").split(";")[0];
    const listing = await fetch(base + "/api/admin/bookings", {
      headers: { Cookie: cookie },
    });
    assert.equal(listing.status, 200);
    assert.match(listing.headers.get("cache-control"), /no-store/);
    const page = await listing.json();
    const matches = page.items.filter((i) => i.id === id);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].status, "new");
    assert.equal(matches[0].details.name, name);
    assert.equal(matches[0].details.vehicle, input.vehicle);
    assert.equal(matches[0].details.phone, input.phone);
    assert.equal(
      (
        await send(
          "/api/admin/bookings",
          { id, status: "published" },
          cookie,
          "PATCH",
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await send(
          "/api/admin/bookings",
          { id: "business", status: "new" },
          cookie,
          "PATCH",
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await send(
          "/api/admin/bookings",
          { id, status: "contacted" },
          cookie,
          "PATCH",
          "https://other.example",
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await send(
          "/api/admin/bookings",
          { id, status: "contacted" },
          cookie,
          "PATCH",
        )
      ).status,
      200,
    );
    const filtered = await fetch(
      base + "/api/admin/bookings?status=contacted",
      { headers: { Cookie: cookie } },
    );
    assert.equal(filtered.status, 200);
    assert.equal(
      (await filtered.json()).items.find((i) => i.id === id).status,
      "contacted",
    );
    assert.equal((await fetch(base + "/api/bookings")).status, 405);
    const home = await fetch(base + "/");
    assert.equal((await home.text()).includes(name), false);
  } finally {
    if (cookie) await send("/api/admin/logout", {}, cookie);
    const env = Object.fromEntries(
      readFileSync(".dev.vars", "utf8")
        .split("\n")
        .filter((l) => l.includes("="))
        .map((l) => {
          const n = l.indexOf("=");
          return [l.slice(0, n), l.slice(n + 1).trim()];
        }),
    );
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      const cleaned = await fetch(
        env.SUPABASE_URL +
          "/rest/v1/settings?id=eq." +
          encodeURIComponent("booking:" + id),
        {
          method: "DELETE",
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
      );
      assert.equal(cleaned.ok, true, "Remove only the synthetic test request");
    }
  }
});
