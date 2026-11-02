# GosaviOn Group admin guide

Open `/admin` on the website, or use **Admin** in the footer.

- Username: `admin` by default. Set the server environment variable `ADMIN_USERNAME` if you want a different username.
- Password: the existing password remains unchanged. Its verifier is stored in `ADMIN_PASSWORD_HASH`; the plaintext password is not included in the code.
- After deploying this change, sign in with both username and password. Local and Vercel passwords may differ.

## Ready to use

- **Overview:** counts of tour packages, currently visible content and drafts; setup status.
- **Tour packages:** add or edit destinations, itinerary, descriptions, cover photo, duration, starting price and unit, inclusions/exclusions, category and season label.
- **Services:** edit the same relevant fields for business/city transfers, family/outstation, spiritual visits, hospital pickup/drop, groups/occasions and hiring a driver for the customer's car.
- **Photos:** upload JPG, PNG or WebP covers up to 5 MB, or use an HTTPS image URL.
- **Seasonal publishing:** optional Show from / Show until dates use India dates, including the end date. Check Published on website and Save changes. Uncheck it to archive content without deleting it. Drafts and out-of-season pages are hidden publicly.
- **Homepage placement:** Featured on homepage controls visibility in the relevant featured section. Seasonal text comes from Business settings → Homepage seasonal message.
- **Business settings:** contact details, operating cities, about text, website domain, vehicle categories and capacities, and FAQs.
- **Preview:** inspect the card before saving and open the saved public page after publishing.
- **Shared updates:** changes are saved to the server database and appear for visitors on their next page load; no code change is needed.
- **Access:** username/password sign-in, login throttling, eight-hour signed sessions and sign-out. Content/image writes are protected server-side.

## Outside this admin's scope

Web3Forms emails bookings to the inbox linked to its access key. There is no booking inbox, live availability calendar, payment handling, customer account system, multiple admin roles or password-reset screen in this version. Web3Forms keys, administrator credentials and deployment settings are managed in the host's environment settings.
