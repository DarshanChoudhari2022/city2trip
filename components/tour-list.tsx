"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { PackageCard } from "./site";
import type { ContentItem } from "@/lib/validation";
export default function TourList({ items }: { items: ContentItem[] }) {
  const [category, setCategory] = useState("All trips");
  const [query, setQuery] = useState("");
  const categories = ["All trips", ...new Set(items.map((i) => i.category))];
  const filtered = items.filter(
    (i) =>
      (category === "All trips" || i.category === category) &&
      (i.title + " " + i.summary).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="filter-bar">
        <div className="filter-chips">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={category === c ? "selected" : ""}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="Search packages"
            placeholder="Find your next escape"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="package-grid">
        {filtered.map((item) => (
          <PackageCard key={item.id} item={item} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h3>No trips match your search.</h3>
          <p>Try another search, or let us help you plan a custom journey.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setCategory("All trips");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
