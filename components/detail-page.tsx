import { Header, Footer, PageIntro } from "./site";
import { ArrowUpRight, Check, Clock, Compass } from "lucide-react";
import type { ContentItem, Settings } from "@/lib/validation";
export default function DetailPage({
  item,
  settings,
}: {
  item: ContentItem;
  settings: Settings;
}) {
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow={item.kind === "package" ? "Tour packages" : "Our services"}
          title={item.title}
          description={item.summary}
        />
        <section className="container section detail-grid">
          <div>
            <img className="detail-image" src={item.image} alt={item.title} />
            {item.sample && (
              <div className="notice">
                This is a sample itinerary for inspiration. Final destinations,
                availability and inclusions are agreed in your quote.
              </div>
            )}
          {item.destination&&<p><strong>Destination / route:</strong> {item.destination}</p>}
          <h2>A journey that feels like you</h2>
            <p className="preserve-lines">{item.description}</p>
            {item.itinerary && (
              <>
                <h2>
                  {item.kind === "package"
                    ? "Your journey at a glance"
                    : "Ways we can help"}
                </h2>
                <div className="itinerary">
                  {item.itinerary
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <div key={i}>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <p>{line}</p>
                      </div>
                    ))}
                </div>
              </>
            )}
            <div className="inclusions">
              <div>
                <h3>Included / to be arranged</h3>
                {item.inclusions
                  .split("\n")
                  .filter(Boolean)
                  .map((s) => (
                    <p key={s}>
                      <Check size={16} />
                      {s}
                    </p>
                  ))}
              </div>
              <div>
                <h3>Please also consider</h3>
                <p className="preserve-lines">{item.exclusions}</p>
              </div>
            </div>
          </div>
          <aside className="detail-aside">
            <span className="eyebrow">LET’S MAKE A PLAN</span>
            <h2>
              Your journey.
              <br />
              Your kind of quote.
            </h2>
            <p>
              <Clock size={17} />
              {item.duration}
            </p>
            <p>
              <Compass size={17} />
              {item.category}
            </p>
          {item.season&&<p>{item.season}</p>}
            {item.price && (
              <div className="detail-price">
                <small>Starting from</small>
                <strong>₹{Number(item.price).toLocaleString("en-IN")}</strong>
                <small>{item.priceUnit}</small>
              </div>
            )}
            <a
              className="button wide"
              href={"/enquiry?service=" + encodeURIComponent(item.title)}
            >
              Enquire about this trip <ArrowUpRight size={18} />
            </a>
            <small>
              No payment required. Booking is subject to confirmation.
            </small>
          </aside>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
