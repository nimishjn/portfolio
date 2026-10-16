import type { CSSProperties } from 'react'

import { siteUrl } from '@/lib/site'
import { sanitizeSvg } from '@/lib/svg'
import type { Profile, Project, Publication } from '@/payload-types'

/**
 * Banner images, rendered with the site's own CSS and drawings and saved as PNGs by
 * `pnpm banners` (scripts/banners.ts). Sizes follow each platform's recommendation.
 */
export const BANNERS = {
  og: { width: 1200, height: 630, layout: 'card' },
  github: { width: 1280, height: 640, layout: 'card' },
  linkedin: { width: 1584, height: 396, layout: 'wide' },
  x: { width: 1500, height: 500, layout: 'wide' },
} as const

export type BannerKind = keyof typeof BANNERS

type Props = { kind: BannerKind; profile: Profile; publications: Publication[]; projects: Project[] }

export function Banner({ kind, profile, publications, projects }: Props) {
  const { width, height, layout } = BANNERS[kind]
  // The newest two of each that have a drawing, in their order on the site.
  const figures = publications.map((item) => sanitizeSvg(item.figureSvg)).filter((svg): svg is string => Boolean(svg)).slice(0, 2)
  const previews = projects.map((item) => sanitizeSvg(item.previewSvg)).filter((svg): svg is string => Boolean(svg)).slice(0, 2)
  const domain = siteUrl.replace(/^https?:\/\//, '')
  const interests = (profile.researchInterests ?? []).slice(0, 3).map((interest) => interest.label)

  return (
    <div id="banner" className="theme-light relative overflow-hidden bg-bg text-fg" style={{ width, height }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom left, black 15%, transparent 90%)',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 0%, var(--glow) 0%, transparent 50%)' }} />

      <div className="absolute flex items-center gap-3.5" style={layout === 'card' ? { left: 72, top: 60 } : { left: 56, top: 40 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered for a screenshot */}
        <img src="/favicon.svg" width={layout === 'card' ? 44 : 36} height={layout === 'card' ? 44 : 36} alt="" />
        <span className="font-mono text-muted" style={{ fontSize: layout === 'card' ? 21 : 18 }}>
          {domain}
        </span>
      </div>

      {layout === 'card' ? (
        <>
          <div className="absolute" style={{ left: 72, top: 172 }}>
            <Identity profile={profile} nameSize={kind === 'github' ? 92 : 88} chipSize={16} />
          </div>
          <div className="absolute" style={{ left: 72, bottom: 60 }}>
            <Interests labels={interests} size={18} />
          </div>
          <Collage figures={figures} previews={previews} preview={236} figure={160} style={{ right: 56, top: '50%', transform: 'translateY(-50%)' }} />
        </>
      ) : (
        <>
          <div className="absolute flex flex-col justify-center" style={{ left: kind === 'x' ? 400 : 384, top: 0, bottom: 0 }}>
            <Identity profile={profile} nameSize={kind === 'x' ? 72 : 64} chipSize={15} />
            {/* Wraps before it reaches the drawings. */}
            <div style={{ marginTop: kind === 'x' ? 26 : 20, maxWidth: kind === 'x' ? 520 : 660 }}>
              <Interests labels={interests} size={15} />
            </div>
          </div>
          <Collage
            figures={figures}
            previews={previews}
            preview={kind === 'x' ? 268 : 212}
            figure={kind === 'x' ? 198 : 156}
            style={{ right: 64, top: '50%', transform: 'translateY(-50%)' }}
          />
        </>
      )}
    </div>
  )
}

function Identity({ profile, nameSize, chipSize }: { profile: Profile; nameSize: number; chipSize: number }) {
  return (
    <div className="flex flex-col items-start">
      <h1 className="m-0 leading-none font-semibold tracking-[-0.045em]" style={{ fontSize: nameSize }}>
        {profile.name}
      </h1>
      <p
        className="mt-[0.9em] inline-flex items-center gap-2.5 rounded-full border border-line bg-card font-mono leading-[1.4] text-muted"
        style={{ fontSize: chipSize, padding: '0.55em 1.1em 0.55em 0.9em' }}
      >
        <span className="live" aria-hidden="true" />
        {profile.subtitle}
      </p>
    </div>
  )
}

function Interests({ labels, size }: { labels: string[]; size: number }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
      {labels.map((label) => (
        <li key={label} className="rounded-full border border-line bg-card" style={{ fontSize: size, padding: '0.5em 1.05em' }}>
          {label}
        </li>
      ))}
    </ul>
  )
}

/** Two staggered columns: a project above a paper, and a paper above a project. */
function Collage({ figures, previews, preview, figure, style }: { figures: string[]; previews: string[]; preview: number; figure: number; style: CSSProperties }) {
  const gap = Math.round(preview * 0.065)
  return (
    <div className="absolute flex items-start" style={{ ...style, gap }}>
      <div className="flex flex-col items-end" style={{ gap }}>
        {previews[0] && <PreviewTile svg={previews[0]} width={preview} />}
        {figures[0] && <FigureTile svg={figures[0]} width={figure} />}
      </div>
      <div className="flex flex-col items-start" style={{ gap, marginTop: Math.round(figure * 0.3) }}>
        {figures[1] && <FigureTile svg={figures[1]} width={figure} />}
        {previews[1] && <PreviewTile svg={previews[1]} width={preview} />}
      </div>
    </div>
  )
}

const tileShadow = '0 18px 32px -24px rgb(20 20 22 / 0.35)'

function PreviewTile({ svg, width }: { svg: string; width: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line" style={{ width, height: Math.round((width * 200) / 360), boxShadow: tileShadow }}>
      <div className="preview" style={{ height: '100%', borderBottom: 0 }}>
        <span className="preview-art pv fig" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </div>
  )
}

function FigureTile({ svg, width }: { svg: string; width: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-chip" style={{ width, height: Math.round((width * 84) / 112), boxShadow: tileShadow }}>
      <span className="fig block size-full [&>svg]:block [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}
