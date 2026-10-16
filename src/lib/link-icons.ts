/**
 * Icons for the profile links. A link uses one of the site's own glyphs (the brand logos,
 * which Lucide doesn't include) or any Lucide icon, stored as `lucide:<name>`.
 */
import type { TextFieldSingleValidation } from 'payload'

import type { LinkIconName } from '../components/icons'

export const siteIcons: ReadonlyArray<{ value: LinkIconName; label: string }> = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'orcid', label: 'ORCID' },
  { value: 'scholar', label: 'Google Scholar' },
  { value: 'mail', label: 'Email' },
  { value: 'link', label: 'Link' },
]

export const LUCIDE_PREFIX = 'lucide:'

export const isSiteIcon = (value: string): value is LinkIconName => siteIcons.some((icon) => icon.value === value)

/** The Lucide name in a stored value (`lucide:graduation-cap` → `graduation-cap`), or null. */
export const lucideName = (value: string) => (value.startsWith(LUCIDE_PREFIX) ? value.slice(LUCIDE_PREFIX.length) : null)

export const iconLabel = (value: string) =>
  siteIcons.find((icon) => icon.value === value)?.label ?? lucideName(value) ?? value

export const validateLinkIcon: TextFieldSingleValidation = (value) =>
  !value || isSiteIcon(value) || /^lucide:[a-z0-9]+(-[a-z0-9]+)*$/.test(value) || 'Choose an icon from the picker.'
