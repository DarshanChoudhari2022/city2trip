import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const send = (path, body, cookie) =>
  fetch(base + path, {
    method: "POST",
    headers: {
      Origin: base,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
test("live admin endpoint enforces username and password and logs out", async () => {
  const password = readFileSync(".admin-local.txt", "utf8")
    .split("\n")[2]
    .trim();
  assert.equal(
    (await send("/api/admin/login", { username: "wrong", password })).status,
    401,
  );
  assert.equal((await send("/api/admin/login", { password })).status, 401);
  const response = await send("/api/admin/login", {
    username: "admin",
    password,
  });
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/);
  const logout = await send("/api/admin/logout", {}, cookie.split(";")[0]);
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/);
});
