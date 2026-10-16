import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

import { getContent } from './content'
import { loadGeist } from './og-fonts'
import { siteUrl } from './site'

export const bannerSize = { width: 1200, height: 630 }

const INK = '#141416'
const MUTED = '#5B5C64'
const PAPER = '#FCFCFB'
const LINE = '#E6E6E2'
const ACCENT = '#2546C9'

/**
 * The /cv link-preview image, in the site's look: blueprint grid, cobalt glow, the favicon
 * mark, name and role, research interests, and a CV sheet on the right. (The home page's
 * image is a static PNG from `pnpm banners`; see src/components/banner/Banner.tsx.)
 */
export async function renderCvBanner() {
  const [{ profile }, fonts, mark] = await Promise.all([
    getContent(),
    loadGeist(['sans400', 'sans600', 'mono400', 'mono500']),
    readFile(path.join(process.cwd(), 'public/favicon.svg')),
  ])
  const domain = siteUrl.replace(/^https?:\/\//, '')

  return new ImageResponse(
    (
      <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', background: PAPER, color: INK, fontFamily: 'Geist' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: 'linear-gradient(rgba(20,20,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,22,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: `linear-gradient(to bottom left, rgba(252,252,251,0) 0%, rgba(252,252,251,0.55) 45%, ${PAPER} 85%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: 'radial-gradient(circle at 78% 0%, rgba(37,70,201,0.16) 0%, rgba(37,70,201,0) 45%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '64px 72px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
            <img src={`data:image/svg+xml;base64,${mark.toString('base64')}`} width={44} height={44} alt="" />
            <div style={{ marginLeft: 14, fontFamily: 'Geist Mono', fontSize: 21, color: MUTED }}>
              {`${domain}/cv`}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 650 }}>
              <div style={{ marginBottom: 16, fontFamily: 'Geist Mono', fontWeight: 500, fontSize: 20, color: ACCENT }}>Curriculum vitae</div>
              <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1 }}>{profile.name}</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 26,
                  padding: '11px 20px 11px 16px',
                  border: `1px solid ${LINE}`,
                  borderRadius: 999,
                  background: '#FFFFFF',
                  fontFamily: 'Geist Mono',
                  fontSize: 18,
                  color: MUTED,
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 999, background: '#1F8A4C', marginRight: 12 }} />
                {profile.subtitle}
              </div>
            </div>
            <CvSheet />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {(profile.researchInterests ?? []).slice(0, 3).map((interest) => (
              <div
                key={interest.label}
                style={{
                  marginRight: 12,
                  padding: '11px 20px',
                  borderRadius: 999,
                  border: `1px solid ${LINE}`,
                  background: '#FFFFFF',
                  fontSize: 19,
                }}
              >
                {interest.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...bannerSize, fonts },
  )
}

/** A stylised A4 CV page: name, rules and two-column rows. */
function CvSheet() {
  const bar = (width: number, color = LINE, height = 7) => (
    <div style={{ width, height, borderRadius: 4, background: color }} />
  )
  const row = (content: number[]) => (
    <div style={{ display: 'flex', marginTop: 12 }}>
      <div style={{ display: 'flex', width: 58 }}>{bar(40, '#E2E2DE')}</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {content.map((width, i) => (
          <div key={i} style={{ display: 'flex', marginTop: i === 0 ? 0 : 7 }}>
            {bar(width, i === 0 ? '#C9C9C4' : LINE)}
          </div>
        ))}
      </div>
    </div>
  )
  const heading = (width: number) => (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
      {bar(width, INK, 8)}
      <div style={{ marginTop: 8, width: 220, height: 1, background: '#D3D3CE' }} />
    </div>
  )
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 280,
        height: 340,
        marginRight: 40,
        padding: '26px 30px',
        background: '#FFFFFF',
        border: `1px solid ${LINE}`,
        borderRadius: 8,
        boxShadow: '0 28px 48px -28px rgba(20,20,22,0.4)',
        transform: 'rotate(-3deg)',
      }}
    >
      <div style={{ fontFamily: 'Geist Mono', fontSize: 11, color: MUTED }}>Curriculum vitae</div>
      <div style={{ display: 'flex', marginTop: 8 }}>{bar(140, INK, 13)}</div>
      {heading(92)}
      {row([150, 120])}
      {row([136, 96])}
      {heading(118)}
      {row([156, 140, 88])}
      {row([128, 104])}
    </div>
  )
}
