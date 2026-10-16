import { logoUrlOf } from '@/lib/content'
import { formatSiteRange, monogram } from '@/lib/format'
import type { Experience } from '@/payload-types'

import { Section } from './Section'
import { TimelineItem } from './TimelineItem'

export function Timeline({
  id,
  index,
  title,
  items,
  delay,
}: {
  id?: string
  index: string
  title: string
  items: Experience[]
  delay: number
}) {
  return (
    <Section id={id} index={index} title={title} delay={delay}>
      <ol className="tl">
        {items.map((item) => (
          <TimelineItem
            key={item.id}
            when={formatSiteRange(item.startDate, item.endDate)}
            role={item.role}
            org={item.org}
            orgUrl={item.orgUrl ?? undefined}
            tile={monogram(item.org, item.tile)}
            logoUrl={logoUrlOf(item.logo)}
            summary={item.summary}
            badge={item.badge ?? undefined}
            current={!item.endDate}
            bullets={(item.bullets ?? []).map((bullet) => bullet.text)}
          />
        ))}
      </ol>
    </Section>
  )
}
