import { ImageResponse } from 'next/og'

import { loadGeist } from '@/lib/og-fonts'

/**
 * The header's wordmark ("nimish jain" in Geist Mono with the accent block caret) as static
 * PNGs, for places that need an image URL rather than a component (the themed admin panel's
 * sidebar and login). Rendered at 3× for sharpness.
 */
const SCALE = 3
const SIZE = 15 * SCALE

const assets = {
  'logo-light.png': { text: '#141416', caret: '#2546C9' },
  'logo-dark.png': { text: '#ECECEE', caret: '#9CB1FF' },
} as const

type AssetName = keyof typeof assets

export const dynamic = 'force-static'

export function generateStaticParams() {
  return Object.keys(assets).map((asset) => ({ asset }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params
  if (!(asset in assets)) return new Response('Not found', { status: 404 })

  const { text, caret } = assets[asset as AssetName]
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color: text,
          fontFamily: 'Geist Mono',
          fontWeight: 500,
          fontSize: SIZE,
          letterSpacing: '-0.03em',
        }}
      >
        nimish jain
        <div
          style={{
            width: 0.55 * SIZE,
            height: 0.95 * SIZE,
            marginLeft: 0.12 * SIZE,
            marginTop: 0.08 * SIZE,
            borderRadius: 0.06 * SIZE,
            background: caret,
          }}
        />
      </div>
    ),
    { width: 108 * SCALE, height: 30 * SCALE, fonts: await loadGeist(['mono500']) },
  )
}
