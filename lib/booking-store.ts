import { database } from "./repository";
import { hasSupabaseConfig, supabase } from "./supabase";
import {
  bookingId,
  bookingStatus,
  sameBookingDetails,
  type BookingRecord,
  type BookingStatus,
} from "./booking-record";
const key = (id: string) => "booking:" + bookingId(id);
const decode = (payload: unknown): BookingRecord =>
  (typeof payload === "string"
    ? JSON.parse(payload)
    : payload) as BookingRecord;
export class BookingConflictError extends Error {}
/** Private booking documents use a dedicated key namespace in the existing RLS-protected document table. Public settings reads only select id=business. */
export async function storeBooking(record: BookingRecord) {
  let stored: BookingRecord;
  if (hasSupabaseConfig()) {
    const client = supabase();
    const { error } = await client
      .from("settings")
      .upsert(
        { id: key(record.id), payload: record },
        { onConflict: "id", ignoreDuplicates: true },
      );
    if (error) throw error;
    const { data, error: readError } = await client
      .from("settings")
      .select("payload")
      .eq("id", key(record.id))
      .single();
    if (readError) throw readError;
    stored = decode(data.payload);
  } else {
    await database()
      .prepare("INSERT OR IGNORE INTO settings(id,payload) VALUES(?,?)")
      .bind(key(record.id), JSON.stringify(record))
      .run();
    const row = await database()
      .prepare("SELECT payload FROM settings WHERE id=?")
      .bind(key(record.id))
      .first<{ payload: string }>();
    if (!row) throw new Error("Saved request unavailable.");
    stored = decode(row.payload);
  }
  if (!sameBookingDetails(record, stored))
    throw new BookingConflictError(
      "This reference belongs to an earlier request. Please retry the updated form to create a new request.",
    );
  return { id: stored.id, reference: stored.reference };
}
export async function listBookings(offset = 0, status?: BookingStatus) {
  const size = 25;
  if (hasSupabaseConfig()) {
    let query = supabase()
      .from("settings")
      .select("payload", { count: "exact" })
      .like("id", "booking:%");
    if (status) query = query.eq("payload->>status", status);
    const { data, error, count } = await query
      .order("payload->>createdAt", { ascending: false })
      .order("id", { ascending: false })
      .range(offset, offset + size - 1);
    if (error) throw error;
    return {
      items: data.map((r) => decode(r.payload)),
      total: count || 0,
      offset,
      pageSize: size,
    };
  }
  const filter = status ? " AND json_extract(payload,'$.status') = ?" : "";
  const db = database();
  const countQuery = db.prepare(
    "SELECT COUNT(*) AS total FROM settings WHERE id LIKE 'booking:%'" + filter,
  );
  const count = await (status ? countQuery.bind(status) : countQuery).first<{
    total: number;
  }>();
  const query = db.prepare(
    "SELECT payload FROM settings WHERE id LIKE 'booking:%'" +
      filter +
      " ORDER BY json_extract(payload,'$.createdAt') DESC, id DESC LIMIT ? OFFSET ?",
  );
  const rows = await (
    status ? query.bind(status, size, offset) : query.bind(size, offset)
  ).all<{ payload: string }>();
  return {
    items: rows.results.map((r) => decode(r.payload)),
    total: count?.total || 0,
    offset,
    pageSize: size,
  };
}
export async function updateBooking(id: string, status: unknown) {
  const value = bookingStatus(status),
    recordKey = key(id);
  if (hasSupabaseConfig()) {
    const client = supabase();
    const { data, error } = await client
      .from("settings")
      .select("payload")
      .eq("id", recordKey)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const record = {
      ...decode(data.payload),
      status: value,
      updatedAt: new Date().toISOString(),
    };
    const { error: saveError } = await client
      .from("settings")
      .update({ payload: record })
      .eq("id", recordKey);
    if (saveError) throw saveError;
    return record;
  }
  const row = await database()
    .prepare("SELECT payload FROM settings WHERE id=?")
    .bind(recordKey)
    .first<{ payload: string }>();
  if (!row) return null;
  const record = {
    ...decode(row.payload),
    status: value,
    updatedAt: new Date().toISOString(),
  };
  await database()
    .prepare("UPDATE settings SET payload=? WHERE id=?")
    .bind(JSON.stringify(record), recordKey)
    .run();
  return record;
}
