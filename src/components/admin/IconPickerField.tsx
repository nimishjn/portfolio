'use client'

import { Drawer, FieldError, FieldLabel, useDrawerSlug, useField, useModal } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import {
  Suspense,
  use,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { linkIcons, LucideGlyph, type LucideIconNode } from '@/components/icons'
import { iconLabel, isSiteIcon, LUCIDE_PREFIX, lucideName, siteIcons } from '@/lib/link-icons'

import styles from './IconPickerField.module.css'

type LucideData = {
  nodes: Record<string, LucideIconNode>
  tags: Record<string, string[]>
  names: string[]
}

let lucidePromise: Promise<LucideData> | undefined

/** Lucide's icon data (about 1 MB) loads once per admin session, the first time it's needed. */
function loadLucide() {
  lucidePromise ??= Promise.all([import('lucide-static/icon-nodes.json'), import('lucide-static/tags.json')]).then(
    ([nodes, tags]) => ({
      nodes: nodes.default as unknown as Record<string, LucideIconNode>,
      tags: tags.default as unknown as Record<string, string[]>,
      names: Object.keys(nodes.default).sort(),
    }),
  )
  return lucidePromise
}

const termsOf = (query: string) => query.toLowerCase().split(/[\s,]+/).filter(Boolean)

/** Lucide names matching every term, best first: whole name, word start, anywhere in the name, then tags. */
function searchLucide({ names, tags }: LucideData, query: string) {
  const terms = termsOf(query)
  if (terms.length === 0) return names
  const scored: Array<{ name: string; score: number }> = []
  for (const name of names) {
    let score = 0
    for (const term of terms) {
      const points =
        name === term
          ? 4
          : name.split('-').some((word) => word.startsWith(term))
            ? 3
            : name.includes(term)
              ? 2
              : tags[name]?.some((tag) => tag.includes(term))
                ? 1
                : 0
      if (points === 0) {
        score = 0
        break
      }
      score += points
    }
    if (score > 0) scored.push({ name, score })
  }
  return scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).map((match) => match.name)
}

/**
 * Admin field for a profile link's icon: shows the current icon and opens a drawer to search the
 * site's brand glyphs and every Lucide icon.
 */
export const IconPickerField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue, showError, errorMessage, disabled } = useField<string>({ path })
  const drawerSlug = useDrawerSlug('icon-picker')
  const { openModal, closeModal } = useModal()
  const current = value || 'link'
  // Same sizing as Payload's own fields, so `admin.width` works inside a row.
  const style: CSSProperties = {
    ...field.admin?.style,
    ...(field.admin?.width ? ({ '--field-width': field.admin.width } as CSSProperties) : { flex: '1 1 auto' }),
  }

  const choose = (next: string) => {
    setValue(next)
    closeModal(drawerSlug)
  }

  return (
    <div className="field-type" style={style}>
      <FieldLabel label={field.label || 'Icon'} path={path} required={field.required} />
      <button
        type="button"
        className={styles.trigger}
        onClick={() => openModal(drawerSlug)}
        disabled={readOnly || disabled}
        aria-haspopup="dialog"
      >
        <span className={styles.preview}>
          <Suspense fallback={null}>
            <IconPreview value={current} />
          </Suspense>
        </span>
        <span className={styles.name}>{iconLabel(current)}</span>
        <span className={styles.change}>Change</span>
      </button>
      <FieldError message={errorMessage} path={path} showError={showError} />
      <Drawer slug={drawerSlug} title="Choose an icon">
        <IconPicker value={current} onChoose={choose} />
      </Drawer>
    </div>
  )
}

function IconPreview({ value }: { value: string }) {
  if (isSiteIcon(value)) {
    const Icon = linkIcons[value]
    return <Icon size={18} />
  }
  const name = lucideName(value)
  const node = name ? use(loadLucide()).nodes[name] : undefined
  return node ? <LucideGlyph node={node} size={18} strokeWidth={2} /> : null
}

function IconPicker({ value, onChoose }: { value: string; onChoose: (value: string) => void }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const searchRef = useRef<HTMLInputElement>(null)

  // The drawer's focus trap settles focus just after it opens, which would undo `autoFocus`.
  useEffect(() => {
    const timer = window.setTimeout(() => searchRef.current?.focus(), 120)
    return () => window.clearTimeout(timer)
  }, [])
  const terms = termsOf(deferredQuery)
  const sites = siteIcons.filter((icon) =>
    terms.every((term) => `${icon.label} ${icon.value}`.toLowerCase().includes(term)),
  )

  return (
    <div className={styles.picker}>
      <div className={styles.searchBar}>
        <input
          ref={searchRef}
          className={styles.search}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
          placeholder="Search icons, e.g. school, globe or book"
          aria-label="Search icons"
        />
      </div>

      {sites.length > 0 && (
        <section>
          <h4 className={styles.heading}>Brand logos and site icons</h4>
          <div className={styles.grid}>
            {sites.map((icon) => {
              const Icon = linkIcons[icon.value]
              return (
                <Tile key={icon.value} label={icon.label} selected={value === icon.value} onClick={() => onChoose(icon.value)}>
                  <Icon size={22} />
                </Tile>
              )
            })}
          </div>
        </section>
      )}

      <Suspense fallback={<p className={styles.note}>Loading Lucide icons…</p>}>
        <LucideResults query={deferredQuery} value={value} onChoose={onChoose} />
      </Suspense>
    </div>
  )
}

function LucideResults({ query, value, onChoose }: { query: string; value: string; onChoose: (value: string) => void }) {
  const lucide = use(loadLucide())
  const names = useMemo(() => searchLucide(lucide, query), [lucide, query])
  const selected = lucideName(value)

  return (
    <section>
      <h4 className={styles.heading}>
        Lucide <span className={styles.count}>{names.length}</span>
      </h4>
      {names.length > 0 ? (
        <div className={styles.grid}>
          {names.map((name) => (
            <Tile key={name} label={name} selected={name === selected} onClick={() => onChoose(LUCIDE_PREFIX + name)}>
              <LucideGlyph node={lucide.nodes[name]} size={22} strokeWidth={2} />
            </Tile>
          ))}
        </div>
      ) : (
        <p className={styles.note}>No Lucide icons match “{query}”.</p>
      )}
    </section>
  )
}

function Tile({ label, selected, onClick, children }: { label: string; selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={styles.tile} aria-pressed={selected} title={label} onClick={onClick}>
      {children}
      <span className={styles.tileLabel}>{label}</span>
    </button>
  )
}
