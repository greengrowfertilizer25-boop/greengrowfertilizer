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
  title: "Greengrow Fertilizer - Premium Agrochemicals & Bio-Fertilizers India",
  description: "Greengrow Fertilizer is India's leading D2C brand offering premium organic fertilizers, chemical insecticides, fungicides, and customized crop combo sprays directly from factory to farm.",
  keywords: "Greengrow Fertilizer, Greengrow, biofertilizer, humic acid, seaweed extract, chemical insecticide, fungicides, herbicides, Indian agriculture, organic farming",
  authors: [{ name: "Greengrow Fertilizer Dev Team" }],
  openGraph: {
    title: "Greengrow Fertilizer - Premium Agrochemicals & Bio-Fertilizers India",
    description: "Premium chemical & organic crop protection products delivered directly to farmers with laboratory certification.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans">
        <SplashScreen />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
