import StructuredData from "@/components/structured-data";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Route,
  HeartHandshake,
  MapPin,
  CarFront,
  UsersRound,
  Check,
  Sun,
  Headphones,
} from "lucide-react";
import {
  Header,
  Footer,
  SectionHeading,
  ServiceCard,
  PackageCard,
  CTA,
} from "@/components/site";
import BookingPanel from "@/components/booking-panel";
import { readPublicContent, readSettings } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";
export const generateMetadata = () =>
  pageMetadata(
    "Local rides. Outstation journeys.",
    "Plan chauffeur-driven city transfers, family holidays, spiritual journeys and group travel with City2Trip.",
    "/",
  );
export const dynamic = "force-dynamic";
export default async function Home() {
  const [items, settings] = await Promise.all([
    readPublicContent(),
    readSettings(),
  ]);
  return (
    <>
      <StructuredData settings={settings} />
      <Header />
      <main>
        <section className="hero">
          <img
            className="hero-background"
            src="/images/hero.webp"
            alt="A white SUV on a scenic mountain road"
            fetchPriority="high"
          />
          <div className="container hero-content">
            <div className="hero-copy">
              <span className="hero-pill">
                <span /> A RIDE FOR EVERY REASON
              </span>
              <h1>
                Everyday rides.
                <br />
                Extraordinary
                <br />
                <span>journeys.</span>
              </h1>
              <p>
                From city streets to roads less travelled.
                <br />
                Your people. Your plans. Our ride.
              </p>
              <div className="hero-promises">
                <span>
                  <Check size={16} /> Chauffeur-driven
                </span>
                <span>
                  <Check size={16} /> Made for your plans
                </span>
              </div>
            </div>
            <BookingPanel />
          </div>
          <div className="hero-caption">
            <MapPin size={15} /> Wherever life takes you.
          </div>
        </section>
        <div className="trust-strip">
          <div className="container">
            <span>
              <ShieldCheck /> Travel with peace of mind
            </span>
            <span>
              <Route /> Flexible journeys
            </span>
            <span>
              <HeartHandshake /> Personalised assistance
            </span>
            <span>
              <CarFront /> A ride for every occasion
            </span>
          </div>
        </div>
        <section className="section container">
          <SectionHeading
            eyebrow="ONE BRAND. EVERY KIND OF JOURNEY."
            title="A ride for wherever life takes you"
            description="Workdays, weekends and everything in between. We’ve got a journey for you."
            href="/services"
            link="All services"
          />
          <div className="service-grid">
            {items
              .filter((i) => i.kind === "service")
              .slice(0, 3)
              .map((item, index) => (
                <ServiceCard item={item} index={index} key={item.id} />
              ))}
          </div>
        </section>
        <section className="announcement container">
          <div className="announcement-icon">
            <Sun size={27} />
          </div>
          <div>
            <strong>{settings.announcement}</strong>
            <p>Turn a little time off into a journey worth remembering.</p>
          </div>
          <a href="/tours">
            Find your escape <ArrowRight size={18} />
          </a>
        </section>
        <section className="section container">
          <SectionHeading
            eyebrow="A LITTLE FURTHER. A LOT MORE MEMORIES."
            title="Your next escape starts here"
            description="Thoughtfully planned tour ideas. Personalised around you."
            href="/tours"
            link="Explore all packages"
          />
          <div className="package-grid">
            {items
              .filter((i) => i.kind === "package" && i.featured)
              .slice(0, 3)
              .map((item) => (
                <PackageCard key={item.id} item={item} />
              ))}
          </div>
          {items.filter(i=>i.kind==='package'&&i.featured).slice(0,3).some(i=>i.sample)&&<p className="sample-note">
            Packages marked “Sample itinerary” are travel ideas. Routes, availability and
            prices are confirmed with your quote.
          </p>}
        </section>
        <section className="why-section">
          <div className="container why-grid">
            <div>
              <span className="eyebrow">THE CITY2TRIP WAY</span>
              <h2>
                Good journeys begin
                <br />
                with the little things.
              </h2>
              <p>
                Thoughtful planning. Clear conversations.
                <br />
                And room for the moments that matter.
              </p>
              <a href="/contact" className="text-link">
                Get to know us <ArrowRight size={18} />
              </a>
            </div>
            <div className="benefit-grid">
              {[
                [
                  ShieldCheck,
                  "Clarity before you travel",
                  "Know your route, arrangements and quoted inclusions before confirming.",
                ],
                [
                  Route,
                  "Your trip, your way",
                  "Choose your stops, your schedule and the people you take along.",
                ],
                [
                  HeartHandshake,
                  "A human touch",
                  "Discuss your plans with a team that understands your journey.",
                ],
                [
                  Headphones,
                  "Help with the details",
                  "From luggage to pickup points, let’s work out the little things.",
                ],
              ].map(([Icon, title, text]: any) => (
                <div className="benefit" key={title}>
                  <Icon size={25} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section container" id="fleet">
          <SectionHeading
            eyebrow="FIND YOUR COMFORT ZONE"
            title="The right ride for your people"
            description="Tell us your group size and luggage needs. We’ll help arrange a suitable vehicle."
          />
          <div className="fleet-grid">
            {settings.fleet.map((vehicle) => (
              <a
                href={
                  "/enquiry?service=" + encodeURIComponent(vehicle.name + " enquiry")
                }
                className="fleet-card"
                key={vehicle.name}
              >
                <CarFront size={48} strokeWidth={1.2} />
                <div>
                  <h3>{vehicle.name}</h3>
                  <p>{vehicle.description}</p>
                  <small>{vehicle.capacity||'Model and capacity confirmed on enquiry'}</small>
                </div>
                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
        </section>
        <section className="section steps-section">
          <div className="container">
            <SectionHeading
              eyebrow="LESS PLANNING. MORE GOING."
              title="Your journey, in three easy steps"
            />
            <div className="steps">
              {[
                [
                  "01",
                  "Tell us your plans",
                  "Where, when and how many. Share the essentials of your trip.",
                ],
                [
                  "02",
                  "Make it your own",
                  "Discuss your route, vehicle and a personalised quote.",
                ],
                [
                  "03",
                  "Confirm & look forward",
                  "Once the details are agreed, get ready for the journey.",
                ],
              ].map(([n, title, text]) => (
                <div className="step" key={n}>
                  <span>{n}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section container faq-section" id="faqs">
          <div>
            <span className="eyebrow">A FEW THINGS YOU MIGHT WONDER</span>
            <h2>
              Before you hit
              <br />
              the road.
            </h2>
            <p>Have something else in mind?</p>
            <a href="/enquiry" className="text-link">
              Let’s talk about your trip <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="faq-list">
            {settings.faqs.map((f) => (
              <details key={f.question}>
                <summary>
                  {f.question}
                  <span>+</span>
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <CTA />
      </main>
      <Footer settings={settings} />
    </>
  );
}
