import type React from "next";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LoadingFallback } from "@/components/loading-fallback";
import { HighlightNotification } from "@/components/highlight-notification";
import { TokenProvider } from "@/components/token-provider";
import { QueryProvider } from "@/components/query-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Starfield } from "@/components/starfield";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.midnightexplorer.com"),
  title: {
    default: "Midnight Explorer",
    template: `%s | Midnight Explorer`,
  },
  description: "An explorer for the Midnight Network.",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
  },
  openGraph: {
    title: "Midnight Explorer",
    description: "An explorer for the Midnight Network.",
    url: "https://www.midnightexplorer.com",
    siteName: "Midnight Explorer",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Midnight Explorer",
    description: "An explorer for the Midnight network.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>{/* Xóa dòng <link> cho favicon nếu có ở đây */}</head>
      <body
        className={cn(
          `font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`
        )}
      >
        <QueryProvider>
          <TokenProvider>
            <HighlightNotification />
            <div className="min-h-screen bg-background relative">
              <div className="fixed inset-0 z-0">
                <Starfield />
              </div>
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
                </main>
                <Footer />
              </div>
            </div>
            <Analytics />
          </TokenProvider>
        </QueryProvider>
      </body>
      <GoogleAnalytics gaId="G-QT1M3GG0MM" />
    </html>
  );
}
