import { Header, Footer, PageIntro, CTA } from "@/components/site";
import { readSettings } from "@/lib/repository";
export const dynamic = "force-dynamic";
import { pageMetadata } from "@/lib/seo";
export const generateMetadata = () =>
  pageMetadata(
    "About & contact",
    "Get to know GosaviOn Group and plan your local ride or outstation journey.",
    "/contact",
  );
export default async function Contact() {
  const settings = await readSettings();
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="About GosaviOn Group"
          title="Life happens between destinations."
          description="We’re here for the journeys that connect them."
        />
        <section className="container section about-grid">
          <img src="/images/rental-vehicle-v2.png" alt="Toyota Innova Hycross, illustrative rental vehicle" />
          <div>
            <span className="eyebrow">LOCAL RIDES. OUTSTATION JOURNEYS.</span>
            <h2>
              Your everyday.
              <br />
              Your getaway.
            </h2>
            <p className="preserve-lines">{settings.about}</p>
            <h3>Get in touch</h3>
            {settings.phone && (
              <p>
                <a href={"tel:" + settings.phone}>{settings.phone}</a>
              </p>
            )}
            {settings.email && (
              <p>
                <a href={"mailto:" + settings.email}>{settings.email}</a>
              </p>
            )}
            {settings.address && <p>{settings.address}</p>}
            {settings.cities && <p>Serving: {settings.cities}</p>}
            {!settings.phone && !settings.email && (
              <p>Business contact details are being finalised for launch.</p>
            )}
            <a className="button" href="/enquiry">
              Plan your journey
            </a>
          </div>
        </section>
        <CTA />
      </main>
      <Footer settings={settings} />
    </>
  );
}
