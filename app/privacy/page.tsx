import { Header, Footer, PageIntro } from "@/components/site";
import { readSettings } from "@/lib/repository";
export const dynamic = "force-dynamic";
import { pageMetadata } from "@/lib/seo";
export const generateMetadata = () =>
  pageMetadata(
    "Privacy policy",
    "How GosaviOn Group handles travel enquiries and website information.",
    "/privacy",
  );
export default async function Privacy() {
  const s = await readSettings();
  return (
    <>
      <Header />
      <main>
        <PageIntro
          eyebrow="Privacy"
          title="Your details, treated thoughtfully."
          description="How information is handled on the GosaviOn Group website."
        />
        <article className="container section prose">
          <h2>Travel enquiries</h2>
          <p>
            When enabled, our enquiry form asks for your name, contact number,
            optional email, travel route, dates, group size and message. These
            details are used to respond to your request and discuss travel
            arrangements. Please do not include sensitive health, identity or
            payment information in your message.
          </p>
          <h2>Enquiry delivery</h2>
          <p>
            Submitted booking requests are securely stored for the GosaviOn
            Group team to review and respond to. This includes the trip and
            contact details you provide. Only the authorised administrator can
            view these records. When email notifications are configured, these
            details are also sent through Web3Forms to the business inbox.
          </p>
          <h2>Cookies and website operation</h2>
          <p>
            The admin area uses an essential session cookie to keep the
            administrator signed in. It expires after eight hours. Login and
            enquiry attempts may be rate-limited using network information for
            security. This website does not include advertising trackers or
            analytics by default.
          </p>
          <h2>Your choices</h2>
          <p>
            Only submit information you wish to share for your travel enquiry.
            To ask about your information, contact GosaviOn Group using its
            published business contact details.
          </p>
          {s.email && (
            <p>
              <a href={"mailto:" + s.email}>{s.email}</a>
            </p>
          )}
          <p className="notice">
            Launch notice: this policy must be reviewed and completed with the
            business’s verified contact and retention details before enquiry
            collection begins.
          </p>
        </article>
      </main>
      <Footer settings={s} />
    </>
  );
}
