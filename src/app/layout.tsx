import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/AppChrome";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://greengrowfertilizer.com"),
  title: {
    template: "%s | Greengrow Fertilizer",
    default: "Greengrow Fertilizer - Premium Agrochemicals & Bio-Fertilizers India",
  },
  description: "Greengrow Fertilizer is India's leading D2C brand offering premium organic fertilizers, chemical insecticides, fungicides, and customized crop combo sprays directly from factory to farm.",
  keywords: ["Greengrow Fertilizer", "Greengrow", "biofertilizer", "humic acid", "seaweed extract", "chemical insecticide", "fungicides", "herbicides", "Indian agriculture", "organic farming", "direct to farm fertilizer", "buy fertilizer online India"],
  authors: [{ name: "Greengrow Fertilizer Dev Team" }],
  openGraph: {
    title: "Greengrow Fertilizer - Premium Agrochemicals & Bio-Fertilizers India",
    description: "Premium chemical & organic crop protection products delivered directly to farmers with laboratory certification.",
    url: "/",
    siteName: "Greengrow Fertilizer",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Greengrow Fertilizer",
    description: "Premium chemical & organic crop protection products delivered directly to farmers with laboratory certification.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Greengrow Fertilizer",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://greengrowfertilizer.com",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://greengrowfertilizer.com"}/assets/logo.png`,
    "description": "India's leading D2C brand offering premium organic fertilizers and agrochemicals directly from factory to farm.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans">
        <SplashScreen />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
