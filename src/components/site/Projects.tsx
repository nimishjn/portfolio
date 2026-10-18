import { ArrowUpRight, BuildingIcon, UserIcon } from '@/components/icons'
import { sanitizeSvg } from '@/lib/svg'
import type { Project } from '@/payload-types'

import { ProjectPreview } from './ProjectPreview'
import { Section } from './Section'
import { ShowMoreGrid } from './ShowMoreGrid'
import { SpotlightCard } from './SpotlightCard'

// How many projects show before Show more; the rest follow in sort order.
const VISIBLE = 4
const GRID = 'grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4'

export function Projects({ items }: { items: Project[] }) {
  const cards = items.map((item) => <ProjectCard key={item.id} item={item} />)

  return (
    <Section id="projects" index="05" title="Projects" delay={0.28}>
      {cards.length > VISIBLE ? (
        <ShowMoreGrid className={GRID} more={cards.slice(VISIBLE)}>
          {cards.slice(0, VISIBLE)}
        </ShowMoreGrid>
      ) : (
        <div className={GRID}>{cards}</div>
      )}
    </Section>
  )
}

function ProjectCard({ item }: { item: Project }) {
  return (
    <SpotlightCard className="flex flex-col overflow-hidden">
      {/* Custom SVG is sanitised on save and again here. */}
      <ProjectPreview svg={sanitizeSvg(item.previewSvg)} />
      <div className="flex flex-1 flex-col px-[22px] pt-5 pb-[22px]">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="font-mono text-xs text-muted">{item.year}</span>
          <ContextLabel context={item.context} org={item.org} />
        </div>
        <h3 className="mt-2 text-[17px] leading-[1.45] font-medium tracking-[-0.01em]">{item.title}</h3>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">{item.description}</p>
        {item.stack && item.stack.length > 0 && (
          <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="Stack">
            {item.stack.map((entry) => (
              <li key={entry.id ?? entry.label} className="chip">
                {entry.label}
              </li>
            ))}
          </ul>
        )}
        {item.links && item.links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-[18px]">
            {item.links.map((link) => (
              <a key={link.id ?? link.url} className="pill" href={link.url}>
                {link.label}
                <ArrowUpRight className="arrow" />
              </a>
            ))}
          </div>
        )}
      </div>
    </SpotlightCard>
  )
}

/** "Personal" or "Built at …", so personal work and employer work read differently. */
function ContextLabel({ context, org }: { context: Project['context']; org?: string | null }) {
  if (context === 'organisation' && org) {
    return (
      <span className="ctx">
        <BuildingIcon />
        Built at {org}
      </span>
    )
  }
  return (
    <span className="ctx">
      <UserIcon />
      Personal
    </span>
  )
}
