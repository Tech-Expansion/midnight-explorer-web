import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { Suspense } from "react"
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.midnightexplorer.com'),
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
    title: 'Midnight Explorer',
    description: 'An explorer for the Midnight Network.',
    url: 'https://www.midnightexplorer.com',
    siteName: 'Midnight Explorer',
    images: [
      {
        url: 'https://www.midnightexplorer.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Midnight Explorer - Blockchain Explorer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Midnight Explorer',
    description: 'An explorer for the Midnight network.',
    images: {
      url: 'https://www.midnightexplorer.com/og-image.jpg',
      alt: 'Midnight Explorer - Blockchain Explorer',
    },
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
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-QT1M3GG0MM" />
    </html>
  );
}
