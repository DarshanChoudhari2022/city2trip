"use client";
import { useState } from "react";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  CarFront,
  Route,
  UsersRound,
  UserRoundCheck,
} from "lucide-react";
export default function BookingPanel() {
  const [mode, setMode] = useState("Outstation");
  return (
    <form action="/enquiry" className="booking-panel">
      <div className="booking-tabs" role="group" aria-label="Trip type">
        {[
          ["Outstation", Route],
          ["Local rides", CarFront],
          ["Group travel", UsersRound],
          ["Hire driver", UserRoundCheck],
        ].map(([label, Icon]: any) => (
          <button
            type="button"
            key={label}
            className={mode === label ? "active" : ""}
            onClick={() => setMode(label)}
            aria-pressed={mode === label}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
      <input
        type="hidden"
        name="service"
        value={mode === "Hire driver" ? "Hire a driver for your car" : mode}
      />
      <div className="booking-inner">
        <h2>Where are we taking you?</h2>
        <p>Your journey, planned around you.</p>
        <label className="field-with-icon">
          <MapPin size={19} />
          <span>
            Pickup location
            <input
              name="pickup"
              placeholder="Enter your city or pickup point"
              required
            />
          </span>
        </label>
        <label className="field-with-icon">
          <MapPin size={19} />
          <span>
            Destination
            <input
              name="destination"
              placeholder="Where would you like to go?"
              required
            />
          </span>
        </label>
        <label className="field-with-icon">
          <CalendarDays size={19} />
          <span>
            Travel date
            <input
              type="date"
              name="date"
              aria-label="Travel date"
              required
              min={new Date().toLocaleDateString("en-CA")}
            />
          </span>
        </label>
        <button className="button wide" type="submit">
          Explore my ride <ArrowRight size={19} />
        </button>
        <small className="booking-note">
          Just an enquiry. No payment needed.
        </small>
      </div>
    </form>
  );
}
