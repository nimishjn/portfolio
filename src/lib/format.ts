const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

type DateInput = string | Date | null | undefined

/** Dates are stored as UTC midnight on the first of the month, so read them in UTC. */
function parts(input: DateInput) {
  if (!input) return null
  const date = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(date.getTime())) return null
  return { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() }
}

/**
 * Site date ranges: "Feb 2026 – now", "Jun – Aug 2023", "Nov 2022 – Jun 2023",
 * or with `grain: 'year'`: "2020 – 2024".
 */
export function formatSiteRange(start: DateInput, end: DateInput, grain: 'month' | 'year' = 'month') {
  const s = parts(start)
  const e = parts(end)
  if (!s) return ''

  if (grain === 'year') {
    if (!e) return `${s.year} – now`
    return s.year === e.year ? String(s.year) : `${s.year} – ${e.year}`
  }

  const from = `${MONTHS[s.month]} ${s.year}`
  if (!e) return `${from} – now`
  if (s.year === e.year) {
    return s.month === e.month ? from : `${MONTHS[s.month]} – ${MONTHS[e.month]} ${e.year}`
  }
  return `${from} – ${MONTHS[e.month]} ${e.year}`
}

/** CV date ranges in the German tabular style: "08/2020 – 06/2024", "02/2026 – present". */
export function formatCvRange(start: DateInput, end: DateInput) {
  const s = parts(start)
  const e = parts(end)
  if (!s) return ''
  const format = (p: NonNullable<ReturnType<typeof parts>>) => `${String(p.month + 1).padStart(2, '0')}/${p.year}`
  return `${format(s)} – ${e ? format(e) : 'present'}`
}

/** "May 2023", or "October 2026" with `long`. */
export function formatMonthYear(input: DateInput, style: 'short' | 'long' = 'short') {
  const p = parts(input)
  if (!p) return ''
  return `${(style === 'long' ? MONTHS_LONG : MONTHS)[p.month]} ${p.year}`
}

/** "11.10.2026" */
export function formatDayDate(input: DateInput) {
  const p = parts(input)
  if (!p) return ''
  return `${String(p.day).padStart(2, '0')}.${String(p.month + 1).padStart(2, '0')}.${p.year}`
}

export function doiUrl(doi: string) {
  return `https://doi.org/${doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '')}`
}

/** "arXiv:2305.05904" for arXiv links, "Preprint" otherwise. */
export function preprintLabel(url: string) {
  const match = url.match(/arxiv\.org\/(?:abs|pdf)\/([^/?#]+?)(?:\.pdf)?(?:[?#].*)?$/i)
  return match ? `arXiv:${match[1]}` : 'Preprint'
}

/** Monogram for an organisation tile: the explicit tile, or the first letter. */
export function monogram(org: string, tile?: string | null) {
  return (tile?.trim() || org.trim().charAt(0)).toUpperCase()
}
