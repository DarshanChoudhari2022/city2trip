import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const send = (path, body, cookie, origin = base) =>
  fetch(base + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
test("public routes render and admin is protected", async () => {
  for (const path of [
    "/",
    "/services",
    "/tours",
    "/contact",
    "/enquiry",
    "/privacy",
    "/services/airport-transfers",
    "/tours/hills-and-happy-memories",
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /GosaviOn Group/);
  }
  const admin = await fetch(base + "/admin");
  assert.match(await admin.text(), /Admin password/);
  assert.equal((await send("/api/admin/content", {})).status, 401);
  assert.equal(
    (await send("/api/admin/content", {}, "city2trip_admin=forged")).status,
    401,
  );
  assert.equal(
    (await send("/api/admin/content", {}, undefined, "https://evil.example"))
      .status,
    403,
  );
});
test("unconfigured enquiry never reports success", async () => {
  const response = await send("/api/enquiry", {});
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /No enquiry has been sent/);
});
test("admin can publish and unpublish shared content without exposing drafts", async () => {
  const password = readFileSync(".admin-local.txt", "utf8").split("\n")[2];
  const login = await send("/api/admin/login", { username:'admin',password });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie").split(";")[0];
  assert.match(login.headers.get("set-cookie"), /HttpOnly/);
  const id = "qa-" + Date.now();
  const item = {
    id,
    kind: "package",
    slug: id,
    title: "QA shared publishing",
    summary: "Integration verification sample.",
    description: "A temporary test record, unpublished after testing.",
    category: "QA",
    image: "/images/hills.jpg",
    duration: "1 day",
    price: "",
    priceUnit: "per vehicle",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    season: "All year",
    startDate: "",
    endDate: "",
    featured: false,
    published: false,
    sample: true,
  };
  try {
    assert.equal((await send("/api/admin/content", item, cookie)).status, 200);
    assert.equal((await fetch(base + "/tours/" + id)).status, 404);
    assert.equal(
      (await send("/api/admin/content", { ...item, published: true }, cookie))
        .status,
      200,
    );
    const visible = await fetch(base + "/tours/" + id);
    assert.equal(visible.status, 200);
    assert.match(await visible.text(), /QA shared publishing/);
    const duplicate = await send(
      "/api/admin/content",
      { ...item, id: id + "-duplicate" },
      cookie,
    );
    assert.equal(duplicate.status, 400);
    assert.equal(
      (await send("/api/admin/content", { ...item, price: "-1" }, cookie))
        .status,
      400,
    );
    assert.equal(
      (
        await send(
          "/api/admin/content",
          { ...item, published: true, startDate: "2099-01-01" },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal((await fetch(base + "/tours/" + id)).status, 404);
    assert.equal((await send("/api/admin/upload", {}, undefined)).status, 401);
  } finally {
    await send("/api/admin/content", { ...item, published: false }, cookie);
    await send("/api/admin/logout", {}, cookie);
  }
});
test("SEO endpoints and missing routes return correctly", async () => {
  assert.equal((await fetch(base + "/robots.txt")).status, 200);
  const sitemap = await fetch(base + "/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type"), /xml/);
  assert.equal((await fetch(base + "/tours/not-a-real-trip")).status, 404);
});
