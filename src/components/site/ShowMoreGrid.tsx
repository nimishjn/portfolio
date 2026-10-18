'use client'

import { useId, useState, type ReactNode } from 'react'

import { ChevronDown } from '@/components/icons'

/**
 * A grid whose `children` always show and whose `more` items wait behind a Show more toggle.
 * The hidden items are rendered all the same, so they are in the page's HTML for search
 * engines; they are only kept from displaying until a visitor asks for them.
 */
export function ShowMoreGrid({ className, more, children }: { className: string; more: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <>
      <div className={className}>
        {children}
        {/* display: contents lets the extra items join the grid as if they were its own. */}
        <div id={id} className={open ? 'show-more contents' : 'hidden'}>
          {more}
        </div>
      </div>
      <button type="button" className="pill mt-4" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
        {open ? 'Show less' : 'Show more'}
        <ChevronDown className="chev" />
      </button>
    </>
  )
}
