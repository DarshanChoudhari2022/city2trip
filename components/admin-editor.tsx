"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  CarFront,
  Settings as SettingsIcon,
  Plus,
  LogOut,
  ArrowUpRight,
  Save,
  Inbox,
} from "lucide-react";
import { Logo, PackageCard } from "./site";
import BookingInbox from "./booking-inbox";
import { isVisible, type ContentItem, type Settings } from "@/lib/validation";
type Tab =
  | "Overview"
  | "Tour packages"
  | "Services"
  | "Business settings"
  | "Booking requests";
const blankItem = (kind: "package" | "service"): ContentItem => ({
  id: "",
  kind,
  title: "",
  slug: "",
  summary: "",
  description: "",
  category: kind === "package" ? "Family" : "City travel",
  image: "/images/vehicle.webp",
  duration: "",
  destination: "",
  price: "",
  priceUnit: "per vehicle",
  itinerary: "",
  inclusions: "",
  exclusions: "",
  season: "All year",
  startDate: "",
  endDate: "",
  featured: false,
  published: false,
  sample: false,
});
export default function AdminEditor({
  initialItems,
  initialSettings,
  enquiriesEnabled,
}: {
  initialItems: ContentItem[];
  initialSettings: Settings;
  enquiriesEnabled: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [settings, setSettings] = useState(initialSettings);
  const [tab, setTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const notify = (message: string, error = false) => {
    setMessage(message);
    setError(error);
  };
  async function api(path: string, body: unknown) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as {
      item: ContentItem;
      settings: Settings;
      url: string;
      error: string;
    };
    if (!response.ok) throw new Error(result.error || "Unable to save.");
    return result;
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      const result = await api("/api/admin/content", editing);
      setItems((old) =>
        old.some((i) => i.id === result.item.id)
          ? old.map((i) => (i.id === result.item.id ? result.item : i))
          : [...old, result.item],
      );
      setEditing(result.item);
      notify(
        result.item.published
          ? "Saved. Published content is now available to visitors within its display dates."
          : "Draft saved. It is hidden from the public website.",
      );
    } catch (e) {
      notify(e instanceof Error ? e.message : "Unable to save.", true);
    } finally {
      setBusy(false);
    }
  }
  async function upload(file?: File) {
    if (!file || !editing) return;
    setBusy(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as {
        item: ContentItem;
        settings: Settings;
        url: string;
        error: string;
      };
      if (!response.ok) throw new Error(result.error);
      setEditing((old) => (old ? { ...old, image: result.url } : old));
      notify("Image uploaded. Save your changes to use it.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Upload failed.", true);
    } finally {
      setBusy(false);
    }
  }
  const change = (key: keyof ContentItem, value: string | boolean) =>
    setEditing((old) => (old ? { ...old, [key]: value } : old));
  const openTab = (next: Tab) => {
    if (
      editing &&
      !confirm("Leave the editor? Any unsaved changes will be lost.")
    )
      return;
    setTab(next);
    setEditing(null);
    setMessage("");
    setPreview(false);
  };
  async function logout() {
    try {
      await api("/api/admin/logout", {});
      window.location.href = "/admin";
    } catch (e) {
      notify("Unable to sign out. Please try again.", true);
    }
  }
  const list = items.filter(
    (i) => i.kind === (tab === "Services" ? "service" : "package"),
  );
  return (
    <div className="admin-page">
      <header className="admin-header">
        <Logo />
        <div>
          <a href="/" target="_blank" rel="noreferrer">
            View website ↗
          </a>
          <button className="button secondary small" onClick={logout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          {[
            ["Overview", LayoutDashboard],
            ["Booking requests", Inbox],
            ["Tour packages", Map],
            ["Services", CarFront],
            ["Business settings", SettingsIcon],
          ].map(([label, Icon]: any) => (
            <button
              key={label}
              className={tab === label ? "active" : ""}
              onClick={() => openTab(label)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
          <p>
            Your updates are saved securely and shared with all website
            visitors.
          </p>
        </aside>
        <main className="admin-main">
          <div className="admin-title">
            <div>
              <span className="eyebrow">GOSAVION CONTENT STUDIO</span>
              <h1>
                {editing
                  ? editing.id
                    ? "Edit " + editing.title
                    : "Create a new " + editing.kind
                  : tab === "Overview"
                    ? "Ready for your next season?"
                    : tab}
              </h1>
              <p>
                {editing
                  ? "Make your changes, preview, then save."
                  : "Keep your journeys fresh. No code needed."}
              </p>
            </div>
            {!editing && ["Services", "Tour packages"].includes(tab) && (
              <button
                className="button"
                onClick={() => {
                  setEditing(
                    blankItem(tab === "Services" ? "service" : "package"),
                  );
                  setMessage("");
                }}
              >
                <Plus size={17} /> Add{" "}
                {tab === "Services" ? "service" : "package"}
              </button>
            )}
          </div>
          {message && (
            <div
              className={"admin-message" + (error ? " error" : "")}
              role={error ? "alert" : "status"}
            >
              {message}
            </div>
          )}
          {editing ? (
            <form className="admin-editor" onSubmit={save}>
              <div className="form-grid">
                <label>
                  Title
                  <input
                    value={editing.title}
                    required
                    maxLength={150}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditing((old) =>
                        old
                          ? {
                              ...old,
                              title,
                              slug: old.id
                                ? old.slug
                                : title
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/^-|-$/g, ""),
                            }
                          : old,
                      );
                    }}
                  />
                </label>
                <label>
                  Page URL slug
                  <input
                    value={editing.slug}
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    onChange={(e) => change("slug", e.target.value)}
                  />
                </label>
                <label>
                  Category
                  <input
                    value={editing.category}
                    required
                    onChange={(e) => change("category", e.target.value)}
                    list="categories"
                  />
                  <datalist id="categories">
                    {[
                      "Family",
                      "Spiritual",
                      "Group travel",
                      "City travel",
                      "Outstation",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </datalist>
                </label>
                <label>
                  Duration
                  <input
                    value={editing.duration}
                    placeholder="3 days · 2 nights"
                    onChange={(e) => change("duration", e.target.value)}
                  />
                </label>
                <label className="span-2">
                  Destination / route <small>(optional)</small>
                  <input
                    value={editing.destination || ""}
                    onChange={(e) => change("destination", e.target.value)}
                    maxLength={250}
                  />
                </label>
                <label className="span-2">
                  Short description
                  <textarea
                    value={editing.summary}
                    required
                    rows={2}
                    maxLength={300}
                    onChange={(e) => change("summary", e.target.value)}
                  />
                </label>
                <label className="span-2">
                  Full description
                  <textarea
                    value={editing.description}
                    required
                    rows={5}
                    maxLength={12000}
                    onChange={(e) => change("description", e.target.value)}
                  />
                </label>
                <label className="span-2">
                  Image URL
                  <input
                    value={editing.image}
                    onChange={(e) => change("image", e.target.value)}
                    required
                  />
                  <img
                    className="admin-preview"
                    src={editing.image}
                    alt="Current cover preview"
                  />
                </label>
                <label className="span-2">
                  Or upload a cover image{" "}
                  <small>(JPG, PNG or WebP, maximum 5 MB)</small>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => upload(e.target.files?.[0])}
                    disabled={busy}
                  />
                </label>
                <label>
                  Starting price in ₹ <small>(leave blank for quote)</small>
                  <input
                    type="number"
                    min="0"
                    max="10000000"
                    step="0.01"
                    value={editing.price}
                    onChange={(e) => change("price", e.target.value)}
                  />
                </label>
                <label>
                  Price unit
                  <input
                    value={editing.priceUnit}
                    placeholder="per vehicle"
                    onChange={(e) => change("priceUnit", e.target.value)}
                  />
                </label>
                <label>
                  Season label
                  <input
                    value={editing.season}
                    placeholder="Winter getaway"
                    onChange={(e) => change("season", e.target.value)}
                  />
                </label>
                <div />
                <label>
                  Show from <small>(optional, India date)</small>
                  <input
                    type="date"
                    value={editing.startDate}
                    onChange={(e) => change("startDate", e.target.value)}
                  />
                </label>
                <label>
                  Show until <small>(optional, inclusive)</small>
                  <input
                    type="date"
                    value={editing.endDate}
                    min={editing.startDate}
                    onChange={(e) => change("endDate", e.target.value)}
                  />
                </label>
                <label className="span-2">
                  {editing.kind === "package"
                    ? "Itinerary"
                    : "Service highlights"}{" "}
                  <small>(one step per line)</small>
                  <textarea
                    value={editing.itinerary}
                    rows={4}
                    onChange={(e) => change("itinerary", e.target.value)}
                  />
                </label>
                <label>
                  Inclusions <small>(one per line)</small>
                  <textarea
                    value={editing.inclusions}
                    rows={4}
                    onChange={(e) => change("inclusions", e.target.value)}
                  />
                </label>
                <label>
                  Exclusions / additional charges
                  <textarea
                    value={editing.exclusions}
                    rows={4}
                    onChange={(e) => change("exclusions", e.target.value)}
                  />
                </label>
              </div>
              <div className="checks">
                {[
                  ["published", "Published on website"],
                  ["featured", "Featured on homepage"],
                  ["sample", "Sample itinerary"],
                ].map(([key, label]) => (
                  <label className="checkbox-line" key={key}>
                    <input
                      type="checkbox"
                      checked={editing[key as keyof ContentItem] as boolean}
                      onChange={(e) =>
                        change(key as keyof ContentItem, e.target.checked)
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
              <p className="fine-print">
                Uncheck “Published on website” to archive this item. Display
                dates also control public visibility.
              </p>
              <div className="admin-actions">
                <button className="button" disabled={busy}>
                  <Save size={16} />
                  {busy ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setPreview(!preview)}
                >
                  {preview ? "Hide preview" : "Preview card"}
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    if (
                      confirm("Close the editor? Unsaved changes will be lost.")
                    ) {
                      setEditing(null);
                      setPreview(false);
                    }
                  }}
                >
                  Close editor
                </button>
                {editing.id && isVisible(editing) && (
                  <a
                    className="text-link"
                    target="_blank"
                    rel="noreferrer"
                    href={
                      "/" +
                      (editing.kind === "package" ? "tours" : "services") +
                      "/" +
                      editing.slug
                    }
                  >
                    Open saved page <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
              {preview && (
                <div style={{ maxWidth: 380, marginTop: 20 }}>
                  <PackageCard item={editing} />
                </div>
              )}
            </form>
          ) : tab === "Booking requests" ? (
            <BookingInbox />
          ) : tab === "Overview" ? (
            <>
              <div className="admin-stats">
                <div className="admin-stat">
                  <strong>
                    {items.filter((i) => i.kind === "package").length}
                  </strong>
                  <span>Tour packages</span>
                </div>
                <div className="admin-stat">
                  <strong>{items.filter((i) => isVisible(i)).length}</strong>
                  <span>Visible on website</span>
                </div>
                <div className="admin-stat">
                  <strong>{items.filter((i) => !i.published).length}</strong>
                  <span>Unpublished drafts</span>
                </div>
              </div>
              <div className="admin-editor">
                <h2>Make this season yours.</h2>
                <p>
                  Update a package’s itinerary, photo or starting price. Publish
                  when you’re ready, and your website will show the changes
                  immediately.
                </p>
                <button
                  className="button"
                  onClick={() => openTab("Tour packages")}
                >
                  Manage tour packages <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="admin-help">
                <h3>Before welcoming customers</h3>
                <ul>
                  <li>
                    {settings.phone || settings.email
                      ? "Contact details added."
                      : "Add your real phone number, email and operating cities in Business settings."}
                  </li>
                  <li>
                    {enquiriesEnabled
                      ? "Web3Forms is configured. Verify delivery before launch."
                      : "Booking requests are saved in admin. Web3Forms email notifications are not configured yet."}
                  </li>
                  <li>
                    Review sample packages, confirm your real services and
                    unpublish anything you do not offer.
                  </li>
                  <li>
                    Confirm pricing, privacy policy and your domain before
                    public launch.
                  </li>
                </ul>
              </div>
            </>
          ) : tab === "Business settings" ? (
            <form
              className="admin-editor"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  const result = await api("/api/admin/settings", settings);
                  setSettings(result.settings);
                  notify("Business settings published.");
                } catch (e) {
                  notify(
                    e instanceof Error ? e.message : "Unable to save.",
                    true,
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2>The details behind your business</h2>
              <div className="form-grid">
                {[
                  ["phone", "Business phone"],
                  ["email", "Business email"],
                  ["cities", "Operating cities"],
                  ["domain", "Website domain (https://…)"],
                  ["address", "Business address"],
                  ["announcement", "Homepage seasonal message"],
                ].map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      type={key === "email" ? "email" : "text"}
                      value={settings[key as keyof Settings] as string}
                      onChange={(e) =>
                        setSettings({ ...settings, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
                <label className="span-2">
                  About GosaviOn Group
                  <textarea
                    rows={5}
                    value={settings.about}
                    onChange={(e) =>
                      setSettings({ ...settings, about: e.target.value })
                    }
                  />
                </label>
              </div>
              <h3>Vehicle categories</h3>
              <p>
                Add only vehicle options you can arrange. Leave capacity blank
                until confirmed.
              </p>
              {settings.fleet.map((v, index) => (
                <div className="form-grid" key={index}>
                  <label>
                    Vehicle category
                    <input
                      value={v.name}
                      required
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          fleet: settings.fleet.map((f, i) =>
                            i === index ? { ...f, name: e.target.value } : f,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    Capacity / luggage
                    <input
                      value={v.capacity}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          fleet: settings.fleet.map((f, i) =>
                            i === index
                              ? { ...f, capacity: e.target.value }
                              : f,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    Description
                    <input
                      value={v.description}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          fleet: settings.fleet.map((f, i) =>
                            i === index
                              ? { ...f, description: e.target.value }
                              : f,
                          ),
                        })
                      }
                    />
                  </label>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        fleet: settings.fleet.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Remove vehicle category
                  </button>
                </div>
              ))}
              <button
                className="button secondary"
                type="button"
                disabled={settings.fleet.length >= 12}
                onClick={() =>
                  setSettings({
                    ...settings,
                    fleet: [
                      ...settings.fleet,
                      { name: "", description: "", capacity: "" },
                    ],
                  })
                }
              >
                Add vehicle category
              </button>
              <h3 style={{ marginTop: 30 }}>Frequently asked questions</h3>
              {settings.faqs.map((faq, index) => (
                <div className="faq-editor" key={index}>
                  <label>
                    Question
                    <input
                      value={faq.question}
                      required
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          faqs: settings.faqs.map((f, i) =>
                            i === index
                              ? { ...f, question: e.target.value }
                              : f,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    Answer
                    <textarea
                      value={faq.answer}
                      required
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          faqs: settings.faqs.map((f, i) =>
                            i === index ? { ...f, answer: e.target.value } : f,
                          ),
                        })
                      }
                    />
                  </label>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        faqs: settings.faqs.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="text-link"
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    faqs: [...settings.faqs, { question: "", answer: "" }],
                  })
                }
                disabled={settings.faqs.length >= 20}
              >
                + Add question
              </button>
              <div className="admin-actions">
                <button className="button" disabled={busy}>
                  <Save size={17} />
                  {busy ? "Saving…" : "Publish settings"}
                </button>
              </div>
            </form>
          ) : (
            <div className="admin-list">
              {list.map((item) => (
                <article className="admin-row" key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>
                      {item.category} · {item.duration || "Flexible duration"}
                    </p>
                  </div>
                  <span
                    className={
                      "status-badge" + (!isVisible(item) ? " draft" : "")
                    }
                  >
                    {!item.published
                      ? "Draft"
                      : !isVisible(item)
                        ? "Outside season"
                        : "Published"}
                  </span>
                  <button
                    className="button secondary small"
                    onClick={() => {
                      setEditing(item);
                      setMessage("");
                    }}
                  >
                    Edit
                  </button>
                </article>
              ))}
              {!list.length && (
                <div className="empty-state">
                  <h2>A fresh start.</h2>
                  <p>
                    Add your first{" "}
                    {tab === "Services" ? "service" : "tour package"} above.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
