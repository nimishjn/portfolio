'use client'

import type { HTMLAttributes, PointerEvent } from 'react'

import { cx } from '@/lib/cx'

/** A `.card` whose accent spotlight follows a mouse pointer. Touch and pen input are ignored. */
export function SpotlightCard({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    card.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  const leave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty('--mx')
    event.currentTarget.style.removeProperty('--my')
  }

  return (
    <article className={cx('card', className)} onPointerMove={move} onPointerLeave={leave} {...rest}>
      {children}
    </article>
  )
}
