'use client'

import { PrintIcon } from '@/components/icons'

export function PrintButton() {
  return (
    <button type="button" className="pill" onClick={() => window.print()}>
      <PrintIcon />
      Print
    </button>
  )
}
