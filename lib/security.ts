const encoder = new TextEncoder();
const hex = (b: ArrayBuffer) =>
  Array.from(new Uint8Array(b), (v) => v.toString(16).padStart(2, "0")).join(
    "",
  );
const bytes = (h: string) =>
  new Uint8Array(h.match(/.{2}/g)!.map((v) => parseInt(v, 16)));
async function key(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}
export async function signSession(secret: string, now = Date.now()) {
  const value = String(now + 8 * 3600_000) + ":" + crypto.randomUUID();
  return (
    value +
    "." +
    hex(
      await crypto.subtle.sign(
        "HMAC",
        await key(secret),
        encoder.encode(value),
      ),
    )
  );
}
export async function verifySession(
  token: string,
  secret: string,
  now = Date.now(),
) {
  try {
    const [value, sig, ...extra] = token.split(".");
    const expires = Number(value.split(":")[0]);
    if (
      extra.length ||
      !sig ||
      !/^[a-f0-9]{64}$/.test(sig) ||
      !expires ||
      expires <= now ||
      expires > now + 8 * 3600_000
    )
      return false;
    return await crypto.subtle.verify(
      "HMAC",
      await key(secret),
      bytes(sig),
      encoder.encode(value),
    );
  } catch {
    return false;
  }
}
export async function hashPassword(
  password: string,
  salt = hex(crypto.getRandomValues(new Uint8Array(16)).buffer),
) {
  const base = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: bytes(salt), iterations: 100000 },
    base,
    256,
  );
  return "pbkdf2:100000:" + salt + ":" + hex(hash);
}
export async function checkPassword(password: string, verifier: string) {
  const parts = verifier.split(":");
  if (
    parts.length !== 4 ||
    parts[0] !== "pbkdf2" ||
    parts[1] !== "100000" ||
    !/^[a-f0-9]{32}$/.test(parts[2]) ||
    !/^[a-f0-9]{64}$/.test(parts[3])
  )
    return false;
  const computed = await hashPassword(password, parts[2]);
  let diff = computed.length ^ verifier.length;
  for (let i = 0; i < computed.length; i++)
    diff |= computed.charCodeAt(i) ^ verifier.charCodeAt(i);
  return diff === 0;
}
