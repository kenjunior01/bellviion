import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ============================================================
// SEO — Metadados otimizados para mercados US/UK/CA/AU/EU
// ============================================================
export const metadata: Metadata = {
  metadataBase: new URL("https://www.bellviion.com"),
  title: {
    default: "Bellviion — Viral TikTok Products | Free Worldwide Shipping to US, UK, CA & AU",
    template: "%s | Bellviion — Trending Products, Free Worldwide Shipping",
  },
  description:
    "Shop the most viral products from TikTok & Instagram at Bellviion. Trending gadgets, home decor, beauty tools & gifts with free worldwide shipping to the US, UK, Canada, Australia and Europe. Secure PayPal checkout, 30-day money-back guarantee.",
  keywords: [
    "viral products", "tiktok products", "trending gadgets 2026", "dropshipping store",
    "bellviion", "viral tiktok gadgets", "gifts for her", "gifts under 25",
    "sunset lamp", "galaxy projector", "cloud slippers", "ice roller",
    "free worldwide shipping", "paypal store", "trending products usa",
    "viral finds uk", "trending products australia", "cool gadgets 2026",
  ],
  authors: [{ name: "Bellviion" }],
  creator: "Bellviion",
  publisher: "Bellviion",
  formatDetection: { telephone: false },
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.bellviion.com",
    siteName: "Bellviion",
    title: "Bellviion — Viral Products People Are Obsessed With 🔥",
    description:
      "Hand-picked viral finds from TikTok & Instagram shipped worldwide. Free shipping $35+, PayPal secure checkout, 30-day guarantee. Join 50,000+ happy customers.",
    images: [
      {
        url: "/products/hero-banner.png",
        width: 1440,
        height: 720,
        alt: "Bellviion — Viral trending products store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bellviion — Viral Products People Are Obsessed With 🔥",
    description:
      "Trending TikTok finds with free worldwide shipping & PayPal checkout. 50,000+ happy customers.",
    images: ["/products/hero-banner.png"],
  },
  alternates: { canonical: "https://www.bellviion.com" },
  category: "ecommerce",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD — dados estruturados para Google Rich Results
function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "Bellviion",
    url: "https://www.bellviion.com",
    logo: "https://www.bellviion.com/products/hero-banner.png",
    description:
      "Viral products from TikTok & Instagram with free worldwide shipping and secure PayPal checkout.",
    sameAs: [
      "https://www.tiktok.com/@bellviion",
      "https://www.instagram.com/bellviion",
      "https://www.facebook.com/bellviion",
      "https://twitter.com/bellviion",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "28000",
      bestRating: "5",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@bellviion.com",
      availableLanguage: ["English", "Portuguese"],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bellviion",
    url: "https://www.bellviion.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.bellviion.com/?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([organization, website]) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <JsonLd />
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
