import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/clientProviders";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
});

const siteUrl = "https://my-weather-rho-coral.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Skyview — Real-Time Weather, Forecasts & Radar",
    template: "%s | Skyview",
  },
  description:
    "Skyview gives you real-time weather conditions, hourly and daily forecasts, live precipitation radar, and location comparisons — fast, accurate, and built for anywhere in the world.",
  keywords: [
    "weather app",
    "weather forecast",
    "live radar",
    "hourly forecast",
    "daily forecast",
    "precipitation map",
    "Skyview weather",
    "current weather conditions",
  ],
  authors: [{ name: "Ayomide" }],
  creator: "Ayomide",
  applicationName: "Skyview",
  category: "weather",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Skyview",
    title: "Skyview — Real-Time Weather, Forecasts & Radar",
    description:
      "Real-time weather, hourly and daily forecasts, and live precipitation radar for anywhere in the world.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skyview weather app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skyview — Real-Time Weather, Forecasts & Radar",
    description:
      "Real-time weather, hourly and daily forecasts, and live precipitation radar for anywhere in the world.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${bricolage.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}