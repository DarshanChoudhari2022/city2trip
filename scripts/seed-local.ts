import { writeFileSync } from "node:fs";
import { seedItems, defaultSettings } from "../lib/seed.ts";
const quote = (s: string) => "'" + s.replaceAll("'", "''") + "'";
const statements = seedItems.map(
  (i) =>
    `INSERT OR IGNORE INTO content(id,slug,kind,payload,updated_at) VALUES(${[i.id, i.slug, i.kind, JSON.stringify(i), new Date().toISOString()].map(quote).join(",")});`,
);
statements.push(
  `INSERT OR IGNORE INTO settings(id,payload) VALUES('business',${quote(JSON.stringify(defaultSettings))});`,
);
writeFileSync(".seed-local.sql", statements.join("\n"));
console.log(
  "Generated local sample seed SQL; existing content will not be overwritten.",
);
