/**
 * The illustration at the top of a project card: the project's own SVG from the CMS
 * (already sanitised by the caller), or a placeholder that stands for code.
 */
export function ProjectPreview({ svg }: { svg?: string | null }) {
  return (
    <div className="preview" aria-hidden="true">
      {svg ? (
        // `pv` and `fig` expose both class vocabularies to custom drawings.
        <span className="preview-art pv fig" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <svg className="pv" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid meet">
          <CodePlaceholder />
        </svg>
      )}
    </div>
  )
}

// Each line of code as [x, width, keyword?] tokens, indented like real code.
const LINES: Array<Array<[number, number, boolean?]>> = [
  [[72, 30, true], [108, 56]],
  [[86, 70]],
  [[86, 22, true], [114, 46], [166, 22]],
  [[100, 58]],
  [[86, 36]],
  [[72, 14, true]],
]

/** An editor window with a few lines of code and a blinking caret, beside the </> mark. */
function CodePlaceholder() {
  return (
    <>
      <rect className="panel" x="36" y="30" width="204" height="140" rx="12" />
      {[54, 66, 78].map((cx) => (
        <circle key={cx} className="sk" cx={cx} cy="47" r="3.5" />
      ))}
      <text className="t" x="96" y="50">
        app.tsx
      </text>
      <line className="edge" x1="36" y1="62" x2="240" y2="62" />
      {LINES.map((tokens, line) => (
        <g key={line}>
          <text className="t" x="52" y={85 + line * 14}>
            {line + 1}
          </text>
          {tokens.map(([x, width, keyword]) => (
            <rect key={x} className={keyword ? 'c-c' : 'sk'} x={x} y={78 + line * 14} width={width} height="7" rx="3.5" />
          ))}
        </g>
      ))}
      <rect className="caret" x="90" y="146" width="2" height="11" rx="1" />

      <circle className="c-a" cx="298" cy="100" r="42" />
      <path className="pattern draw" pathLength={100} d="M284 80l-18 20 18 20" />
      <path className="pattern draw" pathLength={100} d="M312 80l18 20-18 20" />
      <path className="pattern" d="M304 76l-12 48" />
    </>
  )
}
