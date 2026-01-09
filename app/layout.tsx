import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "İpek Kökdemir – Grafik Tasarım Portföyü",
    template: "%s | İpek Kökdemir",
  },
  description:
    "Grafik tasarım öğrencisi İpek Kökdemir'in yaratıcı çalışmalarını keşfedin. Tipografi, renk teorisi ve görsel iletişim alanlarındaki projeler.",
  keywords: [
    "grafik tasarım",
    "portfolio",
    "tasarım",
    "tipografi",
    "renk teorisi",
    "görsel iletişim",
    "İpek Kökdemir",
  ],
  authors: [{ name: "İpek Kökdemir" }],
  creator: "İpek Kökdemir",
  generator: "Next.js",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
    languages: {
      "tr": "/tr",
      "en": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    url: "/",
    title: "İpek Kökdemir – Grafik Tasarım Portföyü",
    description:
      "Grafik tasarım öğrencisi İpek Kökdemir'in yaratıcı çalışmalarını keşfedin.",
    siteName: "İpek Kökdemir",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "İpek Kökdemir - Grafik Tasarım Portföyü",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "İpek Kökdemir – Grafik Tasarım Portföyü",
    description:
      "Grafik tasarım öğrencisi İpek Kökdemir'in yaratıcı çalışmalarını keşfedin.",
    images: ["/twitter-image.jpg"],
    creator: "@ipekkokdemir",
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
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "İpek Kökdemir",
    jobTitle: "Grafik Tasarım Öğrencisi",
    description:
      "Grafik tasarım öğrencisi. Tipografi, renk teorisi ve görsel iletişim alanlarında çalışmalar yapıyorum.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
