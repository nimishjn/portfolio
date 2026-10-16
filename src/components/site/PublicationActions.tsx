'use client'

import { useId, useState } from 'react'

import { ArrowUpRight, ChevronDown } from '@/components/icons'

import { CopyButton } from './CopyButton'
import { DisclosurePanel } from './Disclosure'

type Panel = 'summary' | 'bibtex'

/** Summary and BibTeX toggles (each with its own panel) plus the preprint link. */
export function PublicationActions({
  summary,
  bibtex,
  preprint,
}: {
  summary: string
  bibtex?: string
  preprint?: { url: string; label: string }
}) {
  const [open, setOpen] = useState<Record<Panel, boolean>>({ summary: false, bibtex: false })
  const id = useId()
  const toggle = (panel: Panel) => setOpen((state) => ({ ...state, [panel]: !state[panel] }))

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="pill"
          aria-expanded={open.summary}
          aria-controls={`${id}-summary`}
          onClick={() => toggle('summary')}
        >
          Summary
          <ChevronDown className="chev" />
        </button>
        {bibtex && (
          <button
            type="button"
            className="pill"
            aria-expanded={open.bibtex}
            aria-controls={`${id}-bibtex`}
            onClick={() => toggle('bibtex')}
          >
            BibTeX
            <ChevronDown className="chev" />
          </button>
        )}
        {preprint && (
          <a className="pill" href={preprint.url} title={preprint.label}>
            {preprint.label.startsWith('arXiv') ? 'arXiv' : 'Preprint'}
            <ArrowUpRight className="arrow" />
          </a>
        )}
      </div>

      <DisclosurePanel id={`${id}-summary`} open={open.summary}>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.65]">{summary}</p>
      </DisclosurePanel>

      {bibtex && (
        <DisclosurePanel id={`${id}-bibtex`} open={open.bibtex}>
          <div className="mt-4 rounded-xl border border-line bg-bg">
            <pre className="overflow-x-auto px-4 pt-4 pb-2 font-mono text-xs leading-[1.65]">{bibtex}</pre>
            <div className="flex justify-end px-2.5 pt-1.5 pb-3">
              <CopyButton text={bibtex} label="Copy BibTeX" withIcon={false} />
            </div>
          </div>
        </DisclosurePanel>
      )}
    </>
  )
}
