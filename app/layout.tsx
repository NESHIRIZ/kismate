import type { Metadata } from "next";
import { Inter, Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { ErrorBoundary } from "./components/error-boundary";
import { MobileBottomNav } from "./components/mobile-bottom-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kismate.app"),
  title: {
    default: "KISMATE — Meaningful Connections",
    template: "%s | KISMATE",
  },
  description:
    "KISMATE is a modern platform designed to help people discover meaningful connections and build genuine relationships.",
  keywords: [
    "dating app",
    "relationship platform",
    "dating",
    "connections",
    "compatibility",
    "KISMATE",
  ],
  authors: [{ name: "KISMATE" }],
  creator: "KISMATE",
  publisher: "KISMATE",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/brand/kismate-icon.svg",
    shortcut: "/images/brand/kismate-icon.svg",
    apple: "/images/brand/kismate-icon.svg",
  },
  openGraph: {
    title: "KISMATE — Meaningful Connections",
    description:
      "Discover people who match your values, lifestyle, and relationship intentions through a thoughtful dating experience.",
    url: "https://kismate.app",
    siteName: "KISMATE",
    type: "website",
    images: [
      {
        url: "/images/brand/kismate-logo.svg",
        width: 1200,
        height: 630,
        alt: "KISMATE — Meaningful Connections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KISMATE — Meaningful Connections",
    description:
      "A modern platform for meaningful relationships built on compatibility, trust, and authentic connection.",
    images: ["/images/brand/kismate-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground antialiased`}
      >
        <ErrorBoundary>
          <SiteHeader />
          {children}
          <SiteFooter />
          <MobileBottomNav />
        </ErrorBoundary>
      </body>
    </html>
  );
}
