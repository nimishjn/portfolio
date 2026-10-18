import { ArrowUpRight } from '@/components/icons'
import { logoUrlOf } from '@/lib/content'
import { formatMonthYear, formatSiteRange, monogram } from '@/lib/format'
import type { Service as ServiceItem, Writing as WritingItem } from '@/payload-types'

import { OrgTile } from './OrgTile'
import { Section } from './Section'

const ROW = 'flex flex-wrap gap-x-6 gap-y-1 border-t border-line py-[18px] first:border-t-0 first:pt-0.5'
const DATE = 'flex-[0_0_10.5rem] font-mono text-[12.5px] leading-[30px] text-muted'

export function Service({ items }: { items: ServiceItem[] }) {
  return (
    <Section index="06" title="Leadership & service" delay={0.32}>
      <div className="flex flex-col">
        {items.map((item) => (
          <div key={item.id} className={ROW}>
            <span className={DATE}>{formatSiteRange(item.startDate, item.endDate, 'year')}</span>
            <div className="flex min-w-0 flex-[999_1_320px] items-start gap-3.5">
              <OrgTile monogram={monogram(item.org, item.tile)} logoUrl={logoUrlOf(item.logo)} />
              <div className="min-w-0">
                <p className="text-base leading-[1.45] font-medium">
                  {item.org} <span className="font-normal text-muted">· {item.role}</span>
                </p>
                <p className="mt-1 max-w-[62ch] text-sm leading-[1.6] text-muted">{item.siteText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export function Writing({ items }: { items: WritingItem[] }) {
  // No empty section: it appears once an article is added under Content → Writing.
  if (items.length === 0) return null

  return (
    <Section index="07" title="Writing" delay={0.36}>
      <div className="flex flex-col">
        {items.map((item) => (
          <a key={item.id} className={`row-link ${ROW} text-fg`} href={item.url}>
            <span className={DATE}>{formatMonthYear(item.date)}</span>
            <span className="flex min-w-0 flex-[999_1_320px] items-center gap-3.5">
              <span className="row-title min-w-0 flex-1 text-[15.5px] leading-normal transition-colors">{item.title}</span>
              <span className="chip">{item.platform}</span>
              <ArrowUpRight size={14} strokeWidth={1.5} className="arrow text-muted" />
            </span>
          </a>
        ))}
      </div>
    </Section>
  )
}
