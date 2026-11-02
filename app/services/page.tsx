import { Header, Footer, PageIntro, ServiceCard, CTA } from "@/components/site";
import { readPublicContent, readSettings } from "@/lib/repository";
export const dynamic = "force-dynamic";
import { pageMetadata } from "@/lib/seo";
export const generateMetadata = () =>
  pageMetadata(
    "Chauffeur-driven travel services",
    "Explore GosaviOn Group airport transfers, driver hire for your own car, business travel, family journeys and group travel.",
    "/services",
  );
export default async function Services() {
  const [items, settings] = await Promise.all([
    readPublicContent(),
    readSettings(),
  ]);
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Our services"
          title="Every reason to go. One place to start."
          description="From the everyday essential to the eagerly awaited escape. Find a service that fits your plans."
        />
        <section className="section container">
          <div className="service-grid">
            {items
              .filter((i) => i.kind === "service")
              .map((item, index) => (
                <ServiceCard item={item} index={index} key={item.id} />
              ))}
          </div>
        </section>
        <CTA />
      </main>
      <Footer settings={settings} />
    </>
  );
}
