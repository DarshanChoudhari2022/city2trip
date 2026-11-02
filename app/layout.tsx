import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "City2Trip | Local Rides. Outstation Journeys.",
    template: "%s | City2Trip",
  },
  description:
    "Plan chauffeur-driven city transfers, family getaways, spiritual journeys and group travel with City2Trip. Explore services and personalised tour ideas.",
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
