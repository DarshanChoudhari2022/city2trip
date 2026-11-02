import {
  ArrowUpRight,
  ArrowRight,
  CarFront,
  ShieldCheck,
  Route,
  UsersRound,
  UserRoundCheck,
  BriefcaseBusiness,
  Plane,
  HeartHandshake,
  Check,
  MapPin,
} from "lucide-react";
import {
  Header,
  Footer,
  SectionHeading,
  PackageCard,
  CTA,
} from "@/components/site";
import BookingPanel from "@/components/booking-panel";
import StructuredData from "@/components/structured-data";
import { readPublicContent, readSettings } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const generateMetadata = () =>
  pageMetadata(
    "Car rental & chauffeur services",
    "GosaviOn Group — car rental, chauffeur services, airport transfers and outstation travel. Built on trust, Drive by Value.",
    "/",
  );
export default async function Home() {
  const [items, settings] = await Promise.all([
    readPublicContent(),
    readSettings(),
  ]);
  const packages = items
    .filter((i) => i.kind === "package" && i.featured)
    .slice(0, 3);
  return (
    <>
      <StructuredData settings={settings} />
      <Header />
      <main>
        <section className="rental-hero">
          <div className="container rental-hero-grid">
            <div className="rental-intro">
              <span className="eyebrow">
                GOSAVION GROUP · VEHICLE & CHAUFFEUR RENTAL
              </span>
              <h1>
                Quality car rental.
                <br />
                For every <em>destination.</em>
              </h1>
              <p>
                Airport transfers, business travel and outstation journeys.{" "}
                <br />A comfortable ride, with a driver you can count on.
              </p>
              <div className="hero-actions">
                <a className="button" href="#plan-your-ride">
                  Find your ride <ArrowUpRight size={17} />
                </a>
                <a href="/services" className="text-link">
                  Explore our services <ArrowRight size={16} />
                </a>
              </div>
              <div className="brand-promise">
                <span>Built on trust,</span> Drive by Value.
              </div>
            </div>
            <div className="rental-vehicle">
              <span className="vehicle-kicker">CITY STREETS. OPEN ROADS.</span>
              <img
                src="/images/rental-vehicle.webp"
                alt="Toyota Innova Hycross, illustrative chauffeur-driven vehicle"
                fetchPriority="high"
              />
              <div className="vehicle-footnote">
                <span>
                  <ShieldCheck size={17} /> Your journey. Our responsibility.
                </span>
                <small>Vehicle model subject to availability</small>
              </div>
            </div>
          </div>
        </section>
        <section className="container booking-shelf" id="plan-your-ride">
          <BookingPanel />
        </section>
        {settings.announcement && (
          <div className="container seasonal-message">
            <span>TRAVEL UPDATE</span>
            <p>{settings.announcement}</p>
            <a href="/tours">
              Explore tours <ArrowRight size={15} />
            </a>
          </div>
        )}
        <section className="section container rental-services">
          <div className="service-vehicle">
            <img
              src="/images/rental-vehicle.webp"
              alt="Illustrative vehicle for family and business travel"
              loading="lazy"
            />
            <span>
              Comfort for the journey.
              <br />
              <strong>Care in every detail.</strong>
            </span>
          </div>
          <div>
            <span className="eyebrow">OUR SERVICES</span>
            <h2>
              The right service.
              <br />
              For the way you travel.
            </h2>
            <p>
              From a single pickup to a complete itinerary, choose the travel
              support you need.
            </p>
            <div className="service-rows">
              {items
                .filter((item) => item.kind === "service" && item.featured)
                .map((item, index) => {
                  const Icon =
                    item.category === "Driver hire"
                      ? UserRoundCheck
                      : [Plane, BriefcaseBusiness, Route, UsersRound][
                          index % 4
                        ];
                  return (
                    <a
                      href={"/services/" + item.slug}
                      className="service-row"
                      key={item.id}
                    >
                      <span className="row-icon">
                        <Icon size={22} />
                      </span>
                      <span>
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                      </span>
                      <ArrowUpRight size={18} />
                    </a>
                  );
                })}
            </div>
          </div>
        </section>
        <section className="advantages-section">
          <div className="container">
            <SectionHeading
              eyebrow="WHY GOSAVION"
              title="Service that earns your trust"
              description="Clear arrangements. Thoughtful assistance. Travel planned around your needs."
            />
            <div className="advantage-grid">
              {[
                [
                  ShieldCheck,
                  "Secure services",
                  "Confirm your pickup, route and travel arrangements before the journey.",
                ],
                [
                  HeartHandshake,
                  "Integrity & ethics",
                  "Clear quotes and an honest conversation about what your trip includes.",
                ],
                [
                  CarFront,
                  "Vehicle & chauffeur rental",
                  "A suitable vehicle and driver for city travel or outstation journeys.",
                ],
                [
                  Route,
                  "Flexible travel plans",
                  "Plan a short transfer, a full day or a multi-day tour with your group.",
                ],
              ].map(([Icon, title, description]: any) => (
                <div className="advantage-card" key={title}>
                  <Icon size={29} strokeWidth={1.5} />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section container" id="fleet">
          <SectionHeading
            eyebrow="VEHICLE OPTIONS"
            title="Choose the space you need"
            description="Share your group size and luggage requirements. We’ll confirm a suitable vehicle."
            href="/enquiry"
            link="Ask about availability"
          />
          <div className="rental-fleet">
            {settings.fleet.map((vehicle, index) => (
              <article className="rental-fleet-card" key={vehicle.name}>
                <span className="fleet-number">0{index + 1}</span>
                <h3>{vehicle.name}</h3>
                <p>{vehicle.description}</p>
                <div className="fleet-photo">
                  {index < 2 ? (
                    <img
                      src="/images/rental-vehicle.webp"
                      alt="Illustrative vehicle; model confirmed on enquiry"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src="/images/group.jpg"
                      alt="Group travel"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="fleet-specs">
                  <span>
                    <UsersRound size={15} />
                    {vehicle.capacity || "Capacity on request"}
                  </span>
                  <span>
                    <Check size={15} /> With chauffeur
                  </span>
                </div>
                <a
                  className="button secondary wide"
                  href={
                    "/enquiry?service=" +
                    encodeURIComponent(vehicle.name + " enquiry")
                  }
                >
                  Enquire now <ArrowUpRight size={17} />
                </a>
              </article>
            ))}
          </div>
        </section>
        {packages.length > 0 && (
          <section className="section tour-section">
            <div className="container">
              <SectionHeading
                eyebrow="TOURS & OUTSTATION"
                title="A change of scene starts here"
                description="Explore a few travel ideas, then customise the route and dates."
                href="/tours"
                link="All tour packages"
              />
              <div className="package-grid">
                {packages.map((item) => (
                  <PackageCard item={item} key={item.id} />
                ))}
              </div>
              {packages.some((i) => i.sample) && (
                <p className="sample-note">
                  Packages marked “Sample itinerary” are travel ideas. Final
                  routes and inclusions are confirmed in your quote.
                </p>
              )}
            </div>
          </section>
        )}
        <section className="section container journey-section">
          <SectionHeading
            eyebrow="ON THE ROAD"
            title="Every part of the journey matters"
            description="Comfortable spaces. Considered details. A route that works for you."
          />
          <div className="journey-grid">
            <figure>
              <img
                src="/images/interior.webp"
                alt="Passenger seating and vehicle interior"
                loading="lazy"
              />
              <figcaption>Room to settle in.</figcaption>
            </figure>
            <figure>
              <img
                src="/images/vehicle-detail.webp"
                alt="Exterior detail of an illustrative rental vehicle"
                loading="lazy"
              />
              <figcaption>Ready for the road ahead.</figcaption>
            </figure>
            <figure>
              <img
                src="/images/group.jpg"
                alt="People spending time together"
                loading="lazy"
              />
              <figcaption>Bring everyone along.</figcaption>
            </figure>
          </div>
        </section>
        <section className="section container faq-section" id="faqs">
          <div>
            <span className="eyebrow">TRAVEL INFORMATION</span>
            <h2>
              A few things
              <br />
              before you book.
            </h2>
            <p>Need help with a specific route?</p>
            <a className="text-link" href="/enquiry">
              Ask our team <ArrowUpRight size={17} />
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
