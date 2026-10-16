import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
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
    // The CV PDF duplicates /cv, so search results should point at the page; the resume is shared
    // by link rather than found through search.
    return ['/cv.pdf', '/resume.pdf'].map((source) => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }))
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

export default withPayload(nextConfig, { devBundleServerPackages: false })
