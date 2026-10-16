'use client'

import { useEffect } from 'react'

/** Opens the print dialog once the web fonts have loaded, so nothing prints in a fallback font. */
export function AutoPrint() {
  useEffect(() => {
    let cancelled = false
    void document.fonts.ready.then(() => {
      if (!cancelled) window.print()
    })
    return () => {
      cancelled = true
    }
  }, [])
  return null
}
