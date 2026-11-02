import { randomBytes } from "node:crypto";
import { writeFileSync, existsSync } from "node:fs";
import { hashPassword } from "../lib/security.ts";
if (existsSync(".dev.vars"))
  throw new Error(
    ".dev.vars already exists; do not overwrite existing credentials.",
  );
const password = randomBytes(18).toString("base64url");
writeFileSync(
  ".dev.vars",
  `ADMIN_PASSWORD_HASH=${await hashPassword(password)}\nADMIN_USERNAME=admin\nSESSION_SECRET=${randomBytes(48).toString("hex")}\n`,
  { mode: 0o600 },
);
writeFileSync(
  ".admin-local.txt",
  `City2Trip LOCAL DEVELOPMENT ONLY\nOpen /admin and use this password:\n${password}\nDo not use this credential in production.\n`,
  { mode: 0o600 },
);
console.log(
  "Local admin configured. Read .admin-local.txt for the password. Neither file belongs in Git.",
);
