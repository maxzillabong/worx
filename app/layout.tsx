import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/cookie-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Worx — AI-Powered Blood Analysis",
  description: "Understand your bloodwork instantly. AI-powered insights from your lab results.",
  openGraph: {
    title: "Worx — AI-Powered Blood Analysis",
    description: "Understand your bloodwork instantly. AI-powered insights from your lab results.",
    type: "website",
    siteName: "Worx",
    url: "https://worx.maxzilla.nl",
  },
  twitter: {
    card: "summary",
    title: "Worx — AI-Powered Blood Analysis",
    description: "Understand your bloodwork instantly. AI-powered insights from your lab results.",
  },
};

// Inline script to apply saved theme before paint — prevents flash
const themeScript = `
  (function() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
