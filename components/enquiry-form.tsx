"use client";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Info } from "lucide-react";
import { indiaDate } from "@/lib/validation";
import { submitBooking } from "@/lib/booking";
import { useRef } from "react";
export default function EnquiryForm({
  accessKey,
  defaults = {},
}: {
  accessKey: string;
  defaults?: Record<string, string>;
}) {
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [service, setService] = useState(
    defaults.service || "Outstation journey",
  );
  const driverHire = /hire.*driver|driver.*your car/i.test(service);
  const submitting = useRef(false);
  const enabled = !!accessKey.trim();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    setState("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      submitting.current = true;
      setBusy(true);
      await submitBooking(
        { ...data, consent: data.consent === "on" },
        accessKey,
      );
      setSent(true);
    } catch (error) {
      setState(
        error instanceof Error
          ? error.message
          : "Unable to send. Please try again.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  if (sent)
    return (
      <div className="success-state" role="status">
        <CheckCircle2 size={44} />
        <h2>Your booking request has been sent.</h2>
        <p>
          Our team will contact you to confirm availability, pricing and pickup
          arrangements. Your reservation is confirmed after you agree the
          details with us.
        </p>
        <a className="button" href="/">
          Back to home
        </a>
      </div>
    );
  return (
    <form onSubmit={submit} className="enquiry-form" aria-busy={busy}>
      <h2>Tell us about your trip</h2>
      <p>
        Send a booking request. Our team will confirm the arrangements with you.
      </p>
      {!enabled && (
        <div className="notice">
          <Info size={20} />
          <span>
            Online enquiries are coming soon. You can explore this form, but it
            cannot send a request yet.
          </span>
        </div>
      )}
      <div className="form-grid">
        <label className="span-2">
          Service or package
          <input
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            maxLength={250}
          />
        </label>
        <label>
          Pickup location
          <input
            name="pickup"
            placeholder="City, airport or address"
            defaultValue={defaults.pickup}
            required
            maxLength={250}
          />
        </label>
        <label>
          Destination
          <input
            name="destination"
            placeholder="Where are you heading?"
            defaultValue={defaults.destination}
            required
            maxLength={250}
          />
        </label>
        <label>
          Travel date
          <input
            type="date"
            name="date"
            defaultValue={defaults.date}
            required
            min={indiaDate()}
          />
        </label>
        <label>
          Pickup time (India)
          <input type="time" name="time" required />
        </label>
        <label>
          Return date <small>(optional)</small>
          <input type="date" name="returnDate" />
        </label>
        <label>
          Travellers
          <input
            type="number"
            name="passengers"
            min="1"
            max="60"
            defaultValue="2"
            required
          />
        </label>
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={250}
          />
        </label>
        <label>
          Phone number
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            required
            placeholder="Your contact number"
            maxLength={25}
          />
        </label>
        <label className="span-2">
          {driverHire
            ? "Your car model & transmission"
            : "Your car / preferred vehicle"}{" "}
          <small>(optional)</small>
          <input
            name="vehicle"
            placeholder={
              driverHire
                ? "e.g. Maruti Baleno, manual"
                : "Vehicle model or preference"
            }
            maxLength={250}
          />
          {driverHire && (
            <small>
              You provide the car. This request is for a driver only.
            </small>
          )}
        </label>
        <label className="span-2">
          Email <small>(optional)</small>
          <input
            type="email"
            name="email"
            autoComplete="email"
            maxLength={250}
          />
        </label>
        <label className="span-2">
          Anything else we should know? <small>(optional)</small>
          <textarea
            name="message"
            placeholder="Preferred vehicle, stops or special requirements…"
            rows={3}
            maxLength={2000}
          />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="checkbox-line">
        <input type="checkbox" name="consent" required />{" "}
        <span>
          I agree to be contacted about this enquiry and have read the{" "}
          <a href="/privacy">privacy policy</a>.
        </span>
      </label>
      {state && (
        <p className="form-error" role="alert">
          {state}
        </p>
      )}
      <button className="button wide" disabled={busy || !enabled}>
        {busy
          ? "Sending…"
          : enabled
            ? "Send booking request"
            : "Online enquiries coming soon"}
        <ArrowUpRight size={18} />
      </button>
      <p className="fine-print">
        No payment required. Availability and pricing are confirmed by our team.
      </p>
    </form>
  );
}
