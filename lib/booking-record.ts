export const BOOKING_STATUSES = [
  "new",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type BookingRecord = {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  status: BookingStatus;
  details: Record<string, string>;
};
import { validateEnquiry } from "./validation.ts";
export function sameBookingDetails(a: BookingRecord, b: BookingRecord) {
  const keys = new Set([...Object.keys(a.details), ...Object.keys(b.details)]);
  return [...keys].every((k) => a.details[k] === b.details[k]);
}
export function bookingId(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
    throw new Error("Invalid booking reference.");
  return value.toLowerCase();
}
export function bookingRecord(input: unknown, id: string): BookingRecord {
  if (!input || typeof input !== "object")
    throw new Error("Invalid booking request.");
  const raw = input as Record<string, unknown>;
  if (raw.website) throw new Error("Unable to submit this request.");
  if (raw.consent !== true)
    throw new Error(
      "Please agree to being contacted about your booking request.",
    );
  const normalized = bookingId(id),
    now = new Date().toISOString();
  return {
    id: normalized,
    reference:
      "GOG-" + normalized.replaceAll("-", "").slice(0, 16).toUpperCase(),
    createdAt: now,
    updatedAt: now,
    status: "new",
    details: validateEnquiry(raw),
  };
}
export function bookingStatus(value: unknown): BookingStatus {
  if (
    typeof value !== "string" ||
    !BOOKING_STATUSES.includes(value as BookingStatus)
  )
    throw new Error("Choose a valid booking status.");
  return value as BookingStatus;
}
