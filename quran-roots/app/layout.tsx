import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/navigation/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QLean | GreenTech Quran Tafsir",
  description:
    "Premium Quran study platform with word-by-word translation, tafsir, root discovery, bookmarking, offline PWA, and admin controls.",
  metadataBase: new URL("https://qlean.app"),
  openGraph: {
    title: "QLean | GreenTech Quran Tafsir",
    description:
      "Premium Quran study platform with word-by-word translation, tafsir, root discovery, bookmarking, offline PWA, and admin controls.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased selection:bg-emerald-400/40 selection:text-slate-950">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
