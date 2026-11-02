import test from "node:test";
import assert from "node:assert/strict";
import {
  validateItem,
  isVisible,
  validateEnquiry,
  safeImage,
} from "../lib/validation.ts";
import {
  signSession,
  verifySession,
  hashPassword,
  checkPassword,
} from "../lib/security.ts";
const item = {
  id: "test",
  kind: "package",
  title: "A mountain escape",
  slug: "mountain-escape",
  summary: "A calm three day journey in the hills.",
  description: "Travel with your family.",
  category: "Family",
  image: "/images/hero.webp",
  duration: "3 days",
  price: "",
  priceUnit: "per vehicle",
  itinerary: "Day 1: arrive",
  inclusions: "Driver",
  exclusions: "Meals",
  season: "All year",
  startDate: "",
  endDate: "",
  featured: true,
  published: true,
  sample: true,
};
test("validates content without accepting unsafe image schemes or slugs", () => {
  assert.equal(validateItem(item).slug, "mountain-escape");
  assert.throws(() => validateItem({ ...item, slug: "../admin" }));
  assert.throws(() => validateItem({ ...item, image: "javascript:alert(1)" }));
  assert.equal(safeImage("https://example.com/a.jpg"), true);
  assert.equal(safeImage("//example.com/x"), false);
});
test("rejects negative prices and inverted availability dates", () => {
  assert.throws(() => validateItem({ ...item, price: "-1" }));
  assert.throws(() =>
    validateItem({ ...item, startDate: "2026-12-20", endDate: "2026-12-01" }),
  );
});
test("draft and out of season content are invisible", () => {
  assert.equal(isVisible(item, "2026-11-02"), true);
  assert.equal(isVisible({ ...item, published: false }, "2026-11-02"), false);
  assert.equal(
    isVisible({ ...item, startDate: "2026-12-01" }, "2026-11-02"),
    false,
  );
  assert.equal(
    isVisible({ ...item, endDate: "2026-10-31" }, "2026-11-02"),
    false,
  );
});
test("enquiries require valid passenger count and future date", () => {
  const e = {
    name: "Test Person",
    phone: "9876543210",
    email: "",
    pickup: "Airport",
    destination: "City centre",
    date: "2099-01-01",
    time: "10:00",
    passengers: "2",
    service: "Airport transfer",
    message: "",
  };
  assert.equal(validateEnquiry(e).name, "Test Person");
  assert.throws(() => validateEnquiry({ ...e, date: "2020-01-01" }));
  assert.throws(() => validateEnquiry({ ...e, passengers: "0" }));
  assert.throws(() => validateEnquiry({ ...e, phone: "123" }));
});
test("session signature prevents forgery and expiry", async () => {
  const secret = "a-test-secret-longer-than-thirty-two-characters";
  const token = await signSession(secret, 1000);
  assert.equal(await verifySession(token, secret, 1001), true);
  assert.equal(await verifySession(token + "x", secret, 1001), false);
  assert.equal(await verifySession(token, secret, 1000 + 9 * 3600_000), false);
  assert.equal(await verifySession(token, "wrong", 1001), false);
});
test("password verifier rejects wrong password", async () => {
  const hashed = await hashPassword("a long test password");
  assert.equal(await checkPassword("a long test password", hashed), true);
  assert.equal(await checkPassword("wrong", hashed), false);
});
