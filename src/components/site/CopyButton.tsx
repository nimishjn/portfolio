'use client'

import { useEffect, useRef, useState } from 'react'

import { CheckIcon, CopyIcon, CrossIcon } from '@/components/icons'
import { cx } from '@/lib/cx'

type Status = 'idle' | 'copied' | 'failed'

const MESSAGES: Record<Exclude<Status, 'idle'>, string> = {
  copied: 'Copied',
  failed: 'Copy failed',
}

/**
 * A pill that copies `text` and shows the result for 1.8s. With an icon, the label stays and the
 * icon turns into a check (or a cross if copying failed); without one, the label reads "Copied" or
 * "Copy failed". Either way a visually hidden live region announces the result.
 */
export function CopyButton({
  text,
  label,
  ariaLabel,
  withIcon = true,
  className,
}: {
  text: string
  label: string
  ariaLabel?: string
  withIcon?: boolean
  className?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    let next: Status = 'copied'
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      next = 'failed'
    }
    setStatus(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), 1800)
  }

  const message = status === 'idle' ? '' : MESSAGES[status]
  const icon =
    status === 'copied' ? (
      <CheckIcon className="pop text-accent" />
    ) : status === 'failed' ? (
      <CrossIcon className="pop" />
    ) : (
      <CopyIcon />
    )

  return (
    <>
      <button
        type="button"
        className={cx('pill', !withIcon && status === 'copied' && 'is-on', className)}
        onClick={copy}
        aria-label={ariaLabel}
      >
        {withIcon && icon}
        <span>{withIcon || status === 'idle' ? label : message}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </>
  )
}
