import type { CSSProperties } from 'react'

/**
 * The small organisation tile: a single-colour logo silhouette when a logo is uploaded
 * (masked from the image, filled with the current text colour), otherwise a monogram.
 * Decorative: the organisation's name is always in the adjacent text.
 */
export function OrgTile({ monogram, logoUrl }: { monogram: string; logoUrl?: string }) {
  return (
    <span className="tile" aria-hidden="true">
      {logoUrl ? (
        <span className="tile-logo" style={{ '--logo': `url("${encodeURI(logoUrl)}")` } as CSSProperties} />
      ) : (
        monogram
      )}
    </span>
  )
}
