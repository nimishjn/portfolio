'use client'

import { useId, useState } from 'react'

import { ChevronDown } from '@/components/icons'
import { cx } from '@/lib/cx'

import { DisclosurePanel } from './Disclosure'
import { OrgTile } from './OrgTile'

/**
 * One role on the timeline. A transparent button covers the whole row and reveals the
 * bullets; the organisation name, when it has a website, is a real link layered above
 * that button (a link can't be nested inside a button).
 */
export function TimelineItem({
  when,
  role,
  org,
  orgUrl,
  tile,
  logoUrl,
  summary,
  badge,
  current,
  bullets,
}: {
  when: string
  role: string
  org: string
  orgUrl?: string
  tile: string
  logoUrl?: string
  summary: string
  badge?: string
  current: boolean
  bullets: string[]
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const expandable = bullets.length > 0

  return (
    <li>
      <div className={cx('tl-row relative', !expandable && 'cursor-default')} data-open={open}>
        {expandable && (
          <button
            type="button"
            className="tl-toggle"
            aria-expanded={open}
            aria-controls={id}
            aria-label={`${role} at ${org}`}
            onClick={() => setOpen((value) => !value)}
          />
        )}
        <span className="tl-date">{when}</span>
        <span className={cx('tl-node', current && 'tl-node-now')} aria-hidden="true" />
        <span className="tl-main flex min-w-0 items-start gap-3.5">
          <OrgTile monogram={tile} logoUrl={logoUrl} />
          <span className="min-w-0 flex-1">
            <span className="block text-base leading-[1.45] font-medium">
              <span className="tl-role transition-colors">{role}</span>{' '}
              <span className="font-normal text-muted">
                ·{' '}
                {orgUrl ? (
                  <a className="tl-org lnk" href={orgUrl}>
                    {org}
                  </a>
                ) : (
                  org
                )}
              </span>
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm leading-normal text-muted">
              <span>{summary}</span>
              {badge && <span className="badge">{badge}</span>}
            </span>
          </span>
          {expandable && <ChevronDown size={16} className="chev mt-[7px] text-muted" />}
        </span>
      </div>
      {expandable && (
        <DisclosurePanel id={id} open={open}>
          <ul className="dash-list tl-bullets text-[14.5px]">
            {bullets.map((bullet) => (
              <li key={bullet} className="max-w-[62ch]">
                {bullet}
              </li>
            ))}
          </ul>
        </DisclosurePanel>
      )}
    </li>
  )
}
