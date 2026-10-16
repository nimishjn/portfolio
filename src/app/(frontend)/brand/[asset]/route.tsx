import { ImageResponse } from 'next/og'

import { loadGeist } from '@/lib/og-fonts'

/**
 * The "Nimish Jain" wordmark as static PNGs, for places that need an image URL rather than
 * a component (the themed admin panel's sidebar and login). Rendered at 3× for sharpness.
 */
const SCALE = 3

const assets = {
  'logo-light.png': '#141416',
  'logo-dark.png': '#ECECEE',
} as const

type AssetName = keyof typeof assets

export const dynamic = 'force-static'

export function generateStaticParams() {
  return Object.keys(assets).map((asset) => ({ asset }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params
  if (!(asset in assets)) return new Response('Not found', { status: 404 })

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color: assets[asset as AssetName],
          fontFamily: 'Geist',
          fontWeight: 600,
          fontSize: 15 * SCALE,
          letterSpacing: '-0.01em',
        }}
      >
        Nimish Jain
      </div>
    ),
    { width: 84 * SCALE, height: 30 * SCALE, fonts: await loadGeist(['sans600']) },
  )
}
