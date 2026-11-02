import { Header, Footer, PageIntro, CTA } from "@/components/site";
import TourList from "@/components/tour-list";
import { readPublicContent, readSettings } from "@/lib/repository";
export const dynamic = "force-dynamic";
import { pageMetadata } from "@/lib/seo";
export const generateMetadata = () =>
  pageMetadata(
    "Tour packages & personalised getaways",
    "Discover family getaways and spiritual tour ideas. Customise your route, dates and travel plans with GosaviOn Group.",
    "/tours",
  );
export default async function Tours() {
  const [items, settings] = await Promise.all([
    readPublicContent(),
    readSettings(),
  ]);
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Tour packages"
          title="Take the scenic route to a good memory."
          description="A weekend away. A meaningful pilgrimage. A long-awaited family trip. Start with an idea and make it yours."
        />
        <section className="section container">
          <TourList items={items.filter((i) => i.kind === "package")} />
          <p className="sample-note">
            Packages marked “Sample itinerary” are travel ideas, not confirmed
            offers. Enquire for your customised quote.
          </p>
        </section>
        <CTA />
      </main>
      <Footer settings={settings} />
    </>
  );
}
