import iconNodes from 'lucide-static/icon-nodes.json'

import { linkIcons, LucideGlyph, type IconProps, type LucideIconNode } from '@/components/icons'
import { isSiteIcon, lucideName } from '@/lib/link-icons'

// Rendered on the server only, so Lucide's full icon set never reaches the browser.
const lucide = iconNodes as unknown as Record<string, LucideIconNode>

/** The icon chosen for a profile link: a site glyph or a Lucide icon, with the link glyph as a fallback. */
export function ProfileLinkIcon({ icon, ...props }: IconProps & { icon?: string | null }) {
  if (icon && isSiteIcon(icon)) {
    const Icon = linkIcons[icon]
    return <Icon {...props} />
  }
  const node = icon ? lucide[lucideName(icon) ?? ''] : undefined
  if (node) return <LucideGlyph node={node} {...props} />
  const Fallback = linkIcons.link
  return <Fallback {...props} />
}
