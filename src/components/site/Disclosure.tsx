'use client'

import { useId, useState, type ReactNode } from 'react'

import { ChevronDown } from '@/components/icons'
import { cx } from '@/lib/cx'

/** The collapsible panel used across the site. Collapsed content is hidden from the tab order. */
export function DisclosurePanel({
  id,
  open,
  className,
  children,
}: {
  id: string
  open: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div id={id} className={cx('disclosure', className)} data-open={open}>
      <div>{children}</div>
    </div>
  )
}

/** A pill toggle with a chevron, followed by its panel. */
export function Disclosure({
  label,
  children,
  className,
  panelClassName,
}: {
  label: ReactNode
  children: ReactNode
  className?: string
  panelClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className={className}>
      <button type="button" className="pill" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
        {label}
        <ChevronDown className="chev" />
      </button>
      <DisclosurePanel id={id} open={open} className={panelClassName}>
        {children}
      </DisclosurePanel>
    </div>
  )
}
