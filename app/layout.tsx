import type { Metadata } from "next";
import "./globals.css";
import "./gosavion.css";
import { env } from "@/lib/platform-env";

export const metadata: Metadata = {
  title: {
    default: "GosaviOn Group | Local Rides. Outstation Journeys.",
    template: "%s | GosaviOn Group",
  },
  description:
    "Plan chauffeur-driven city transfers, family getaways, spiritual journeys and group travel with GosaviOn Group. Explore services and personalised tour ideas.",
  ...(env.GOOGLE_SITE_VERIFICATION?.trim()
    ? { verification: { google: env.GOOGLE_SITE_VERIFICATION.trim() } } : {}),
  ...(env.VERCEL_ENV && env.VERCEL_ENV !== "production"
    ? { robots: { index: false, follow: false } } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
