import { Fragment } from 'react'

import { ArrowUpRight } from '@/components/icons'
import { doiUrl, preprintLabel } from '@/lib/format'
import { sanitizeSvg } from '@/lib/svg'
import type { Publication } from '@/payload-types'

import { PublicationActions } from './PublicationActions'
import { PublicationFigure } from './PublicationFigure'
import { Section } from './Section'
import { SpotlightCard } from './SpotlightCard'

export function Publications({ items, scholarUrl }: { items: Publication[]; scholarUrl?: string }) {
  return (
    <Section
      id="research"
      index="01"
      title="Publications"
      count={items.length}
      delay={0.08}
      aux={
        scholarUrl && (
          <a className="aux-link lnk inline-flex items-center gap-1 text-[13px] text-muted" href={scholarUrl}>
            Google Scholar
            <ArrowUpRight className="arrow" />
          </a>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <PublicationCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  )
}

function PublicationCard({ item }: { item: Publication }) {
  const firstAuthor = item.authors[0]?.isMe
  const venue = [item.venueShort || item.venue, item.volumeIssue].filter(Boolean).join(' ')

  return (
    <SpotlightCard className="flex flex-wrap gap-x-[22px] gap-y-4 p-[22px]">
      {/* Sanitised again at render time, even though the CMS cleans it on save. */}
      <PublicationFigure svg={sanitizeSvg(item.figureSvg)} />
      <div className="min-w-0 flex-[999_1_320px]">
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
          <span>{item.year}</span>
          <span aria-hidden="true">·</span>
          <span>{item.type}</span>
          <span aria-hidden="true">·</span>
          <span>{item.publisher}</span>
          {firstAuthor && <span className="badge">First author</span>}
        </p>
        <h3 className="mt-2 text-[17px] leading-[1.45] font-medium tracking-[-0.01em]">
          <a className="lnk" href={doiUrl(item.doi)}>
            {item.title}
          </a>
        </h3>
        <p className="mt-1.5 text-sm text-muted">
          {item.authors.map((author, i) => (
            <Fragment key={author.id ?? i}>
              {i > 0 && ', '}
              {author.isMe ? <strong className="font-semibold text-fg">{author.short}</strong> : author.short}
            </Fragment>
          ))}
        </p>
        <p className="mt-0.5 text-sm text-muted">
          <em>{venue}</em>
          {item.pages && ` · pp. ${item.pages}`}
        </p>
        <PublicationActions
          summary={item.summary}
          bibtex={item.bibtex ?? undefined}
          preprint={item.preprintUrl ? { url: item.preprintUrl, label: preprintLabel(item.preprintUrl) } : undefined}
        />
      </div>
    </SpotlightCard>
  )
}
