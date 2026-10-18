import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { themeScript } from '@/components/site/ThemeToggle'
import { getContent } from '@/lib/content'
import { siteUrl } from '@/lib/site'

import './globals.css'

// Self-hosted at build time, Latin subset only. Both are preloaded: the mono face sets the
// header's wordmark as well as the small labels.
const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent()
  const title = profile.seoTitle || profile.name
  const [firstName, ...lastNames] = profile.name.split(' ')
  const bing = process.env.BING_SITE_VERIFICATION
  // A static PNG from `pnpm banners`; /cv overrides it with its own generated image.
  const shareImage = {
    url: '/banners/og.png',
    type: 'image/png',
    width: 1200,
    height: 630,
    alt: `${profile.name}: ${profile.subtitle}`,
  }

  return {
    metadataBase: new URL(siteUrl),
    applicationName: profile.name,
    title: { default: title, template: `%s · ${profile.name}` },
    description: profile.metaDescription,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    publisher: profile.name,
    alternates: { canonical: '/' },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/manifest.webmanifest',
    // Stops iOS from turning ORCID iDs and similar digit runs into phone links.
    formatDetection: { telephone: false, address: false, email: false },
    openGraph: {
      type: 'profile',
      firstName,
      lastName: lastNames.join(' '),
      url: siteUrl,
      siteName: profile.name,
      title,
      description: profile.metaDescription,
      locale: 'en_US',
      images: [shareImage],
    },
    twitter: { card: 'summary_large_image', title, description: profile.metaDescription, images: [shareImage] },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1012' },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
