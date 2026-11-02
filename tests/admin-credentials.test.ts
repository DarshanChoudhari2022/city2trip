import test from "node:test";
import assert from "node:assert/strict";
import { checkAdminCredentials, hashPassword } from "../lib/security.ts";
test("admin sign-in requires both the username and correct password", async () => {
  const hash = await hashPassword("correct-test-password");
  assert.equal(
    await checkAdminCredentials("admin", "correct-test-password", hash),
    true,
  );
  assert.equal(
    await checkAdminCredentials("wrong", "correct-test-password", hash),
    false,
  );
  assert.equal(
    await checkAdminCredentials(undefined, "correct-test-password", hash),
    false,
  );
  assert.equal(await checkAdminCredentials("admin", "wrong", hash), false);
});
test("configured administrator username replaces the default", async () => {
  const hash = await hashPassword("correct-test-password");
  assert.equal(
    await checkAdminCredentials(
      "owner",
      "correct-test-password",
      hash,
      "owner",
    ),
    true,
  );
  assert.equal(
    await checkAdminCredentials(
      "admin",
      "correct-test-password",
      hash,
      "owner",
    ),
    false,
  );
});
