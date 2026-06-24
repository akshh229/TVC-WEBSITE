import type { Metadata } from "next";
import { Montserrat, Outfit, Poppins } from "next/font/google";
import "./globals.css";
import { BackgroundVideo } from "@/components/background-video";
import { SiteInteractions } from "@/components/site-interactions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/content";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "The Voyage Club",
    template: "%s | The Voyage Club"
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${outfit.variable} ${poppins.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <BackgroundVideo />
        <SiteInteractions />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
