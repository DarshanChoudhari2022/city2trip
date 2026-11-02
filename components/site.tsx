import {
  ArrowUpRight,
  CarFront,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Compass,
} from "lucide-react";
import type { ContentItem, Settings } from "@/lib/validation";
export function Logo() {
  return (
    <a href="/" className="logo" aria-label="City2Trip home">
      <span>
        city<span className="logo-two">2</span>trip
        <span className="logo-dot">.</span>
      </span>
      <small>LOCAL RIDES. OUTSTATION JOURNEYS.</small>
    </a>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/services">Our services</a>
          <a href="/tours">Tour packages</a>
          <a href="/#fleet">Our rides</a>
          <a href="/#faqs">FAQs</a>
          <a href="/contact">About us</a>
        </nav>
        <a href="/enquiry" className="button small">
          Plan a trip <ArrowUpRight size={17} />
        </a>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav>
            <a href="/services">Our services</a>
            <a href="/tours">Tour packages</a>
            <a href="/#fleet">Our rides</a>
            <a href="/#faqs">FAQs</a>
            <a href="/contact">About & contact</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            From your everyday commute
            <br />
            to your next great escape.
          </p>
          <span className="footer-label">
            A little closer to where you want to be.
          </span>
        </div>
        <div>
          <h3>Explore City2Trip</h3>
          <a href="/services">Our services</a>
          <a href="/tours">Tour packages</a>
          <a href="/contact">About & contact</a>
        </div>
        <div>
          <h3>Travel your way</h3>
          <a href="/services/airport-transfers">Airport transfers</a>
          <a href="/services/family-and-outstation">Outstation journeys</a>
          <a href="/services/group-and-occasions">Group travel</a>
        </div>
        <div>
          <h3>Let’s plan your journey</h3>
          {settings.phone && (
            <a href={"tel:" + settings.phone.replace(/[^+\d]/g, "")}>
              <Phone size={15} />
              {settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={"mailto:" + settings.email}>
              <Mail size={15} />
              {settings.email}
            </a>
          )}
          {settings.cities && (
            <p>
              <MapPin size={15} />
              {settings.cities}
            </p>
          )}
          <a href="/enquiry" className="footer-enquire">
            Enquire about a ride <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} City2Trip. All rights reserved.
        </span>
        <div>
          <a href="/privacy">Privacy policy</a>
          <a href="/admin">Admin</a>
        </div>
      </div>
    </footer>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  link,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {link || "Explore all"} <ArrowRight size={18} />
        </a>
      )}
    </div>
  );
}
export function PackageCard({ item }: { item: ContentItem }) {
  return (
    <article className="package-card">
      <a className="package-image" href={"/tours/" + item.slug}>
        <img src={item.image} alt={item.title} loading="lazy" />
        <span className="image-tag">{item.season || item.category}</span>
        {item.sample && <span className="sample-tag">Sample itinerary</span>}
      </a>
      <div className="package-body">
        <div className="meta">
          <Compass size={14} />
          {item.duration}
          <span>•</span>
          {item.category}
        </div>
        <h3>
          <a href={"/tours/" + item.slug}>{item.title}</a>
        </h3>
        <p>{item.summary}</p>
        <div className="card-bottom">
          <span>
            {item.price ? (
              <>
                <small>Starting from</small>
                <strong>
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </strong>{" "}
                <small>{item.priceUnit}</small>
              </>
            ) : (
              <>
                <small>Made for your plans</small>
                <strong>Get a personalised quote</strong>
              </>
            )}
          </span>
          <a
            className="circle-link"
            href={"/tours/" + item.slug}
            aria-label={"Explore " + item.title}
          >
            <ArrowUpRight size={20} />
          </a>
        </div>
      </div>
    </article>
  );
}
export function ServiceCard({
  item,
  index,
}: {
  item: ContentItem;
  index: number;
}) {
  const icons = [
    <CarFront key="car" />,
    <Compass key="compass" />,
    <MapPin key="pin" />,
  ];
  return (
    <a
      className={"service-card service-" + index}
      href={"/services/" + item.slug}
    >
      <div className="service-top">
        <span className="icon-box">{icons[index % 3]}</span>
        <ArrowUpRight size={20} />
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className="service-tags">
        {item.itinerary
          .split("\n")
          .slice(0, 3)
          .map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
      </div>
    </a>
  );
}
export function CTA() {
  return (
    <section className="container cta">
      <div>
        <span className="eyebrow">THE NEXT JOURNEY STARTS WITH YOU</span>
        <h2>
          Have a destination in mind?
          <br />
          Let’s get you there.
        </h2>
        <p>
          A quick city ride or a journey worth remembering. We’re here to help
          you plan.
        </p>
      </div>
      <a href="/enquiry" className="button white">
        Plan my journey <ArrowUpRight size={19} />
      </a>
    </section>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <div className="container">
        <a className="breadcrumb" href="/">
          Home / {eyebrow}
        </a>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
