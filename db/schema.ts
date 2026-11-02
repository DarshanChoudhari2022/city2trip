import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const content = sqliteTable("content", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  kind: text("kind").notNull(),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  payload: text("payload").notNull(),
});
export const attempts = sqliteTable("attempts", {
  id: text("id").primaryKey(),
  count: integer("count").notNull(),
  expires: integer("expires").notNull(),
});
