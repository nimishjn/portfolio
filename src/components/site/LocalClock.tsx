'use client'

import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kolkata',
})

/** Current time in India. Renders a placeholder on the server and fills in after hydration. */
export function LocalClock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()))
    tick()
    const interval = window.setInterval(tick, 15_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {time ?? '--:--'}
    </time>
  )
}
