import { env } from "@/lib/platform-env";
import { Header, Footer, PageIntro } from "@/components/site";
import EnquiryForm from "@/components/enquiry-form";
import { readSettings } from "@/lib/repository";
import { CheckCircle2, Phone, Mail } from "lucide-react";
export const dynamic = "force-dynamic";
import { pageMetadata } from "@/lib/seo";
export const generateMetadata = () =>
  pageMetadata(
    "Plan your trip",
    "Share your travel plans with GosaviOn Group for a personalised chauffeur-driven journey.",
    "/enquiry",
  );
export default async function Enquiry({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const settings = await readSettings();
  const params = await searchParams;
  const defaults: Record<string, string> = {};
  for (const key of ["service", "pickup", "destination", "date"])
    if (typeof params[key] === "string")
      defaults[key] = params[key].slice(0, 250);
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Plan a trip"
          title="Good journeys start with a hello."
          description="Tell us what you have in mind. We’ll help with the road ahead."
        />
        <section className="container section enquiry-layout">
          <EnquiryForm
            accessKey={env.WEB3FORMS_ACCESS_KEY?.trim() || ""}
            defaults={defaults}
          />
          <aside>
            <span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span>
            <h2>
              Let’s get the
              <br />
              details right.
            </h2>
            {[
              "A route that fits your plans",
              "A vehicle for your group",
              "A personalised, clear quote",
            ].map((s) => (
              <p className="check-row" key={s}>
                <CheckCircle2 size={19} />
                {s}
              </p>
            ))}
            <div className="contact-box">
              <h3>Prefer a conversation?</h3>
              {settings.phone ? (
                <a href={"tel:" + settings.phone}>
                  <Phone size={17} />
                  {settings.phone}
                </a>
              ) : (
                <p>
                  Direct contact details will be available when GosaviOn Group
                  launches.
                </p>
              )}
              {settings.email && (
                <a href={"mailto:" + settings.email}>
                  <Mail size={17} />
                  {settings.email}
                </a>
              )}
            </div>
          </aside>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
