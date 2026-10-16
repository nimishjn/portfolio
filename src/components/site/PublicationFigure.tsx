/**
 * The small figure on a publication card: the publication's own SVG from the CMS (already
 * sanitised by the caller), or a placeholder that stands for a paper.
 */
export function PublicationFigure({ svg }: { svg?: string | null }) {
  return (
    <div className="h-[84px] w-[112px] flex-none overflow-hidden rounded-xl border border-line bg-chip max-[520px]:hidden">
      {svg ? (
        <span
          className="fig block h-[82px] w-[110px] [&>svg]:block [&>svg]:size-full"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <svg className="fig block h-[82px] w-[110px]" viewBox="0 0 112 84" aria-hidden="true">
          {/* A paper over a second sheet: title, lines of text and a small chart that redraws on hover. */}
          <rect className="sheet sheet-back" x="42" y="11" width="42" height="56" rx="4" />
          <rect className="sheet" x="28" y="17" width="42" height="56" rx="4" />
          <path className="acc" d="M34 25h20" />
          <path className="mut" d="M34 31h14M34 37h30M34 42h24" />
          <path className="ax" d="M34 65h30" />
          <polyline className="acc draw" pathLength={100} points="34,62 40,57 46,59 52,52 58,54 64,47" />
        </svg>
      )}
    </div>
  )
}
