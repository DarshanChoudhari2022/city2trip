export type ContentItem = {
  id: string;
  kind: "package" | "service";
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  destination?: string;
  image: string;
  duration: string;
  price: string;
  priceUnit: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  season: string;
  startDate: string;
  endDate: string;
  featured: boolean;
  published: boolean;
  sample: boolean;
};
export type Settings = {
  phone: string;
  email: string;
  address: string;
  cities: string;
  about: string;
  domain: string;
  announcement: string;
  faqs: { question: string; answer: string }[];
  fleet: { name: string; description: string; capacity: string }[];
};
const text = (v: unknown, max = 5000) => {
  if (typeof v !== "string" || v.length > max)
    throw new Error("Please check the text length.");
  return v.trim();
};
export const indiaDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
function date(v: string) {
  if (
    v &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(v) ||
      new Date(v + "T00:00:00Z").toISOString().slice(0, 10) !== v)
  )
    throw new Error("Enter a valid date.");
  return v;
}
export function safeImage(v: string): boolean {
  return (
    /^\/images\/[a-zA-Z0-9._/-]+$/.test(v) ||
    /^\/api\/media\/[a-zA-Z0-9._-]+$/.test(v) ||
    (/^https:\/\//.test(v) &&
      (() => {
        try {
          return !!new URL(v).hostname;
        } catch {
          return false;
        }
      })())
  );
}
export function validateItem(input: any): ContentItem {
  if (!input || typeof input !== "object") throw new Error("Invalid content.");
  const item: any = {};
  for (const k of [
    "id",
    "kind",
    "title",
    "slug",
    "summary",
    "description",
    "category",
    "destination",
    "image",
    "duration",
    "price",
    "priceUnit",
    "itinerary",
    "inclusions",
    "exclusions",
    "season",
    "startDate",
    "endDate",
  ])
    item[k] = text(
      input[k] ?? "",
      k === "description" || k === "itinerary" ? 12000 : 3000,
    );
  if (
    !["package", "service"].includes(item.kind) ||
    !item.title ||
    !item.summary ||
    !item.description
  )
    throw new Error("Title, summary and description are required.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || item.slug.length > 100)
    throw new Error(
      "Use a lowercase URL slug with words separated by hyphens.",
    );
  if (item.id && !/^[a-zA-Z0-9-]{1,100}$/.test(item.id))
    throw new Error("Invalid record ID.");
  if (!safeImage(item.image))
    throw new Error("Use an uploaded image or an HTTPS image URL.");
  if (
    item.price &&
    (!/^\d+(\.\d{1,2})?$/.test(item.price) || Number(item.price) > 10000000)
  )
    throw new Error("Enter a valid positive price or leave it empty.");
  date(item.startDate);
  date(item.endDate);
  if (item.startDate && item.endDate && item.endDate < item.startDate)
    throw new Error("End date must be after start date.");
  for (const k of ["featured", "published", "sample"])
    item[k] = input[k] === true;
  return item;
}
export function isVisible(
  item: Pick<ContentItem, "published" | "startDate" | "endDate">,
  today = indiaDate(),
) {
  return (
    item.published &&
    (!item.startDate || item.startDate <= today) &&
    (!item.endDate || item.endDate >= today)
  );
}
export function validateSettings(input: any): Settings {
  const out: any = {};
  if (!Array.isArray(input.fleet) || input.fleet.length > 12)
    throw new Error("Use up to 12 vehicle categories.");
  out.fleet = input.fleet.map((v: any) => {
    const vehicle = {
      name: text(v.name, 100),
      description: text(v.description, 250),
      capacity: text(v.capacity, 100),
    };
    if (!vehicle.name) throw new Error("Vehicle name is required.");
    return vehicle;
  });
  for (const k of [
    "phone",
    "email",
    "address",
    "cities",
    "about",
    "domain",
    "announcement",
  ])
    out[k] = text(input[k] ?? "");
  if (out.phone && !/^[+\d ()-]{8,25}$/.test(out.phone))
    throw new Error("Enter a valid contact number.");
  if (out.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email))
    throw new Error("Enter a valid email.");
  if (out.domain) {
    const url = new URL(out.domain);
    if (
      url.protocol !== "https:" ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      throw new Error("Use an HTTPS domain without a path.");
    out.domain = url.origin;
  }
  if (!Array.isArray(input.faqs) || input.faqs.length > 20)
    throw new Error("Use up to 20 FAQs.");
  out.faqs = input.faqs
    .map((f: any) => ({
      question: text(f.question, 300),
      answer: text(f.answer, 2000),
    }))
    .filter((f: any) => f.question && f.answer);
  return out;
}
export function validateEnquiry(input: any) {
  const out: any = {};
  for (const k of [
    "name",
    "phone",
    "email",
    "pickup",
    "destination",
    "date",
    "time",
    "returnDate",
    "passengers",
    "vehicle",
    "service",
    "message",
  ])
    out[k] = text(input[k] ?? "", k === "message" ? 2000 : 250);
  if (out.name.length < 2 || !out.pickup || !out.destination || !out.service)
    throw new Error("Please complete your name, route and service.");
  if (
    !/^[+\d ()-]{8,25}$/.test(out.phone) ||
    out.phone.replace(/\D/g, "").length < 8
  )
    throw new Error("Enter a valid phone number.");
  if (out.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email))
    throw new Error("Enter a valid email address.");
  date(out.date);
  date(out.returnDate);
  if (!out.date || out.date < indiaDate())
    throw new Error("Choose today or a future travel date.");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(out.time))
    throw new Error("Choose a valid pickup time.");
  if (new Date(out.date + "T" + out.time + ":00+05:30").getTime() < Date.now())
    throw new Error("Choose a future pickup time.");
  if (out.returnDate && out.returnDate < out.date)
    throw new Error("Return date cannot precede pickup.");
  if (
    !/^\d+$/.test(out.passengers) ||
    Number(out.passengers) < 1 ||
    Number(out.passengers) > 60
  )
    throw new Error("Enter between 1 and 60 travellers.");
  return out;
}
