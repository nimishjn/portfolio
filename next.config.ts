import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Sent with every response.
const securityHeaders = [
  // Browsers use the declared content type instead of guessing one from the bytes.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // No page may be shown in a frame; the CSP's frame-ancestors says the same to newer browsers.
  { key: 'X-Frame-Options', value: 'DENY' },
  // Other sites see the origin of a link from here, not the full URL.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Browser features the site never uses stay off.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  // A page opened from another site, or by this one, gets no handle on this window.
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

type Directives = Record<string, string[]>

// The pages are prerendered, so they can't carry a per-request nonce, and Next's inline bootstrap
// scripts and the layout's theme script need 'unsafe-inline' (a hash would switch it off). The policy
// still keeps out every other origin, plugins, framing, <base> changes and form posts to other sites.
const sitePolicy: Directives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'none'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
}

// The admin also loads from the hosts its packages use.
const adminPolicy: Directives = {
  ...sitePolicy,
  // Monaco, the editor behind the SVG and BibTeX code fields, loads its scripts, stylesheet and icon
  // font from jsDelivr. Its web workers start from blob: URLs and load from jsDelivr too.
  'script-src': [...sitePolicy['script-src'], 'https://cdn.jsdelivr.net'],
  'worker-src': ["'self'", 'blob:'],
  // payload-theme loads Geist from Google Fonts.
  'style-src': [...sitePolicy['style-src'], 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
  'font-src': [...sitePolicy['font-src'], 'data:', 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
  // Files stored in Vercel Blob, and client uploads, which go from the browser straight to Blob's API.
  'img-src': [...sitePolicy['img-src'], 'https://*.public.blob.vercel-storage.com'],
  'connect-src': [...sitePolicy['connect-src'], 'https://vercel.com'],
}

const contentSecurityPolicy = (source: string, directives: Directives) => ({
  source,
  headers: [
    {
      key: 'Content-Security-Policy',
      value: Object.entries(directives)
        .map(([name, sources]) => [name, ...sources].join(' '))
        .join('; '),
    },
  ],
})

const nextConfig: NextConfig = {
  // No X-Powered-By header; withPayload then leaves out its own as well.
  poweredByHeader: false,
  images: {
    // Every image on the site is served through Payload's file route, so the optimizer takes
    // nothing else: a remote pattern would let anyone proxy their own images through this origin.
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // The generated social images read Geist's TTF files and the favicon when they are
  // revalidated. Inside a route group their paths carry a hash suffix, hence the wildcard.
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/geist/dist/fonts/geist-sans/Geist-{Regular,Medium,SemiBold}.ttf',
      './node_modules/geist/dist/fonts/geist-mono/GeistMono-{Regular,Medium}.ttf',
      './public/favicon.svg',
    ],
  },
  async redirects() {
    return [{ source: '/story', destination: '/', permanent: true }]
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // `next dev` runs without a CSP, because its hot reloading needs eval and a websocket. Test the
      // policies with `pnpm build && pnpm start`.
      ...(process.env.NODE_ENV === 'production'
        ? [
            // Every page except the admin, which has its own; /api, whose JSON needs none and whose SVG
            // uploads Payload already serves with `script-src 'none'`; Next's assets, where the image
            // optimizer sets its own; and the PDFs, which browser viewers can refuse to show under a policy.
            contentSecurityPolicy('/:path((?!admin(?:/|$)|api/|_next/|(?:cv|resume)\\.pdf$).*)', sitePolicy),
            contentSecurityPolicy('/admin/:path*', adminPolicy),
          ]
        : []),
      // The CV PDF duplicates /cv, so search results should point at the page; the resume is shared
      // by link rather than found through search.
      ...['/cv.pdf', '/resume.pdf'].map((source) => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] })),
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

const config = withPayload(nextConfig, { devBundleServerPackages: false })
const payloadHeaders = config.headers

// withPayload asks every page for a colour-scheme client hint, which only the admin's theme reads. On the
// public pages it only costs: Critical-CH makes Chrome repeat the request of a first visit, and Vary
// splits their cache. So the hint is limited to the admin.
export default {
  ...config,
  async headers() {
    const entries = (await payloadHeaders?.()) ?? []
    return entries.map((entry) =>
      entry.headers.some(({ key }) => key === 'Critical-CH') ? { ...entry, source: '/admin/:path*' } : entry,
    )
  },
} satisfies NextConfig
