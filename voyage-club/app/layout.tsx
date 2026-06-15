import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { SiteInteractions } from "@/components/site-interactions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/content";

const fontVariables = {
  "--font-display": '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
  "--font-body": '"Avenir Next", "Segoe UI", system-ui, sans-serif',
  "--font-ui": '"SF Pro Text", "Segoe UI", system-ui, sans-serif'
} as CSSProperties;

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
    <html lang="en" style={fontVariables}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <div className="site-bg-video" aria-hidden="true">
          <video autoPlay loop muted playsInline preload="metadata">
            <source src="/backgrounds/grainient-1781321166751.webm" type="video/webm" />
          </video>
        </div>
        <SiteInteractions />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
