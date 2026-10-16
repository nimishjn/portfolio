import type { CSSProperties, ReactNode } from 'react'

/** A page section with the numbered, rail-to-rail heading from the design. */
export function Section({
  id,
  index,
  title,
  count,
  aux,
  delay = 0,
  children,
}: {
  id?: string
  index: string
  title: string
  count?: number
  aux?: ReactNode
  delay?: number
  children: ReactNode
}) {
  return (
    <section id={id} className="reveal pt-18 max-sm:pt-12" style={{ '--delay': `${delay}s` } as CSSProperties}>
      <div className="sh">
        <span className="sh-x sh-x-l" aria-hidden="true" />
        <span className="sh-x sh-x-r" aria-hidden="true" />
        <span className="font-mono text-xs text-accent">{index}</span>
        <h2 className="m-0 text-[22px] leading-tight font-semibold tracking-[-0.025em]">{title}</h2>
        {count != null && (
          <span className="rounded-full border border-line bg-card px-2 py-1 font-mono text-[11.5px] leading-none text-muted">
            {count}
          </span>
        )}
        {aux && <div className="ml-auto">{aux}</div>}
      </div>
      {children}
    </section>
  )
}
