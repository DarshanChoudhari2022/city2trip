"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  RefreshCw,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Inbox,
  ArrowUpRight,
} from "lucide-react";
import { BOOKING_STATUSES, type BookingRecord } from "@/lib/booking-record";
type Page = {
  items: BookingRecord[];
  total: number;
  offset: number;
  pageSize: number;
};
const dateTime = (v: string) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(v));
const title = (v: string) => v[0].toUpperCase() + v.slice(1);
export default function BookingInbox() {
  const [page, setPage] = useState<Page>({
    items: [],
    total: 0,
    offset: 0,
    pageSize: 25,
  });
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const loadVersion = useRef(0);
  const load = useCallback(async () => {
    const version = ++loadVersion.current;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        "/api/admin/bookings?offset=" +
          offset +
          (filter ? "&status=" + filter : ""),
        { cache: "no-store" },
      );
      const result = (await response.json()) as Page & { error?: string };
      if (version !== loadVersion.current) return;
      if (!response.ok)
        throw new Error(result.error || "Unable to load requests.");
      setPage(result);
      if (offset > 0 && offset >= result.total)
        setOffset(
          result.total
            ? Math.floor((result.total - 1) / result.pageSize) * result.pageSize
            : 0,
        );
    } catch (e) {
      if (version === loadVersion.current)
        setError(e instanceof Error ? e.message : "Unable to load requests.");
    } finally {
      if (version === loadVersion.current) setBusy(false);
    }
  }, [offset, filter]);
  useEffect(() => {
    void load();
    return () => {
      loadVersion.current++;
    };
  }, [load]);
  async function changeStatus(item: BookingRecord, status: string) {
    setSaving(item.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status }),
      });
      const result = (await response.json()) as {
        item: BookingRecord;
        error?: string;
      };
      if (!response.ok)
        throw new Error(result.error || "Unable to update status.");
      setNotice("Booking status updated.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update status.");
    } finally {
      setSaving("");
    }
  }
  return (
    <section className="booking-inbox">
      <div className="inbox-toolbar">
        <div>
          <h2>Booking requests</h2>
          <p>
            Submitted requests are saved here, independently of email delivery.
            Newest first.
          </p>
        </div>
        <button
          className="button secondary small"
          onClick={() => void load()}
          disabled={busy}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
      <div className="inbox-filters">
        <label>
          Status
          <select
            value={filter}
            disabled={!!saving}
            onChange={(e) => {
              setFilter(e.target.value);
              setOffset(0);
              setSelected(null);
            }}
          >
            <option value="">All requests</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {title(s)}
              </option>
            ))}
          </select>
        </label>
        <span>
          {page.total} {page.total === 1 ? "request" : "requests"}
        </span>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="admin-message" role="status">
          {notice}
        </p>
      )}
      {busy ? (
        <p role="status">Loading booking requests…</p>
      ) : page.items.length === 0 ? (
        <div className="empty-state">
          <Inbox size={36} />
          <h3>No requests {filter ? "with this status" : "yet"}.</h3>
          <p>New submissions from the booking form will appear here.</p>
        </div>
      ) : (
        <div className="inbox-records">
          {page.items.map((item) => (
            <article className="inbox-record" key={item.id}>
              <div className="inbox-record-header">
                <div>
                  <span className="inbox-reference">{item.reference}</span>
                  <h3>{item.details.name}</h3>
                  <p>{dateTime(item.createdAt)} IST</p>
                </div>
                <label>
                  Status
                  <select
                    aria-label={"Status for " + item.reference}
                    value={item.status}
                    disabled={saving === item.id}
                    onChange={(e) => void changeStatus(item, e.target.value)}
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {title(s)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="inbox-route">
                <strong>{item.details.pickup}</strong>
                <ArrowUpRight size={17} />
                <strong>{item.details.destination}</strong>
              </div>
              <p className="inbox-service">
                {item.details.service} · {item.details.date} at{" "}
                {item.details.time} IST · {item.details.passengers} travellers
              </p>
              <div className="inbox-contact">
                <a href={"tel:" + item.details.phone.replace(/[^+\d]/g, "")}>
                  <Phone size={15} />
                  {item.details.phone}
                </a>
                {item.details.email && (
                  <a href={"mailto:" + item.details.email}>
                    <Mail size={15} />
                    {item.details.email}
                  </a>
                )}
                <button
                  className="text-link"
                  onClick={() =>
                    setSelected(selected === item.id ? null : item.id)
                  }
                  aria-expanded={selected === item.id}
                >
                  {selected === item.id ? "Hide details" : "View full request"}
                </button>
              </div>
              {selected === item.id && (
                <dl className="inbox-details">
                  {[
                    ["Service / package", item.details.service],
                    ["Pickup", item.details.pickup],
                    ["Destination", item.details.destination],
                    [
                      "Travel date / time",
                      item.details.date + " · " + item.details.time + " IST",
                    ],
                    ["Return date", item.details.returnDate || "Not specified"],
                    ["Travellers", item.details.passengers],
                    ["Vehicle / car", item.details.vehicle || "Not specified"],
                    ["Email", item.details.email || "Not supplied"],
                    [
                      "Message",
                      item.details.message || "No additional message",
                    ],
                    ["Last status update", dateTime(item.updatedAt) + " IST"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          ))}
        </div>
      )}
      <div className="inbox-pagination">
        <button
          className="button secondary small"
          disabled={busy || offset === 0}
          onClick={() => {
            setOffset(Math.max(0, offset - page.pageSize));
            setSelected(null);
          }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span>
          {page.total
            ? `${offset + 1}–${Math.min(offset + page.pageSize, page.total)} of ${page.total}`
            : "0 requests"}
        </span>
        <button
          className="button secondary small"
          disabled={busy || offset + page.pageSize >= page.total}
          onClick={() => {
            setOffset(offset + page.pageSize);
            setSelected(null);
          }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
