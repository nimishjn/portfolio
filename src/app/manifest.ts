import type { MetadataRoute } from 'next'

import { getContent } from '@/lib/content'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { profile } = await getContent()
  return {
    name: profile.name,
    short_name: profile.name,
    description: profile.metaDescription,
    start_url: '/',
    display: 'browser',
    background_color: '#FCFCFB',
    theme_color: '#FCFCFB',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
