import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { UnitsProvider } from "@/api/weather-heading/provider/UnitsProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans"
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700","800"],
  variable: "--font-bricolage"
})

export const metadata: Metadata = {
  title: "Weatherly – Your Daily Forecast",
  description: "Check real-time weather updates with a clean, minimal UI.",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${bricolage.variable} antialiased min-h-screen bg-neutral-900 text-neutral-50`}>
        <UnitsProvider>
          <Header />
          <main>{children}</main>
        </UnitsProvider>
      </body>
    </html>
  );
}
