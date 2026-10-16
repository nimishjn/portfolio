import { createElement, type SVGProps } from 'react'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number }

function Icon({ size = 16, strokeWidth = 1.5, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const ArrowUpRight = (props: IconProps) => (
  <Icon size={12} strokeWidth={1.6} {...props}>
    <path d="M5 11l6-6M6 5h5v5" />
  </Icon>
)

export const ChevronDown = (props: IconProps) => (
  <Icon size={14} {...props}>
    <path d="M4 6l4 4 4-4" />
  </Icon>
)

export const CopyIcon = (props: IconProps) => (
  <Icon size={14} {...props}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1" />
  </Icon>
)

export const CheckIcon = (props: IconProps) => (
  <Icon size={14} strokeWidth={1.75} {...props}>
    <path d="M3.5 8.5l3 3 6-7" />
  </Icon>
)

export const CrossIcon = (props: IconProps) => (
  <Icon size={14} strokeWidth={1.75} {...props}>
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
  </Icon>
)

export const DownloadIcon = (props: IconProps) => (
  <Icon strokeWidth={1.6} {...props}>
    <path d="M8 2.5v8M4.5 7.5L8 11l3.5-3.5M3 13.5h10" />
  </Icon>
)

export const FileIcon = (props: IconProps) => (
  <Icon size={14} {...props}>
    <path d="M9.5 1.5h-5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-9z" />
    <path d="M9.5 1.5v3h3M6 8.5h4M6 11h4" />
  </Icon>
)

export const PrintIcon = (props: IconProps) => (
  <Icon size={14} {...props}>
    <path d="M4.5 6V2.5h7V6M4.5 11.5h-2v-5h11v5h-2" />
    <rect x="4.5" y="9.5" width="7" height="4.5" rx="0.5" />
  </Icon>
)

export const ArrowLeft = (props: IconProps) => (
  <Icon size={14} {...props}>
    <path d="M13 8H3M7 4L3 8l4 4" />
  </Icon>
)

export const SunIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
  </Icon>
)

export const MoonIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13.5 9.6A5.5 5.5 0 1 1 6.4 2.5a4.5 4.5 0 0 0 7.1 7.1z" />
  </Icon>
)

/*
 * Brand glyphs, drawn as outlines on a 24px grid to match the rest of the set.
 * GitHub, LinkedIn, mail, user and building are from Tabler Icons (MIT, © Paweł Kuna). ORCID and Google
 * Scholar have no outline versions in common icon sets, so these follow their official
 * marks: "iD" in a circle, and a mortarboard over a head.
 */
export function Glyph({ size = 14, strokeWidth = 2.2, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const MailIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" />
    <path d="M3 7l9 6 9-6" />
  </Glyph>
)

export const GithubIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
  </Glyph>
)

export const LinkedinIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 1 0-4 0" />
    <path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7" />
  </Glyph>
)

export const OrcidIcon = (props: IconProps) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 7.5v.01M8 10.5v6M11 16.5v-6h2.25a3 3 0 0 1 0 6H11z" />
  </Glyph>
)

export const ScholarIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M2.5 9 12 3l9.5 6-9.5 6-9.5-6z" />
    <path d="M7.5 13a5 5 0 1 0 9 0" />
  </Glyph>
)

export const UserIcon = (props: IconProps) => (
  <Glyph size={12} {...props}>
    <path d="M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </Glyph>
)

export const BuildingIcon = (props: IconProps) => (
  <Glyph size={12} {...props}>
    <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
  </Glyph>
)

export const LinkIcon = (props: IconProps) => (
  <Icon size={14} {...props}>
    <path d="M6.5 9.5l3-3M7 4.5l1-1a2.8 2.8 0 0 1 4 4l-1 1M9 11.5l-1 1a2.8 2.8 0 0 1-4-4l1-1" />
  </Icon>
)

export const linkIcons = {
  mail: MailIcon,
  scholar: ScholarIcon,
  orcid: OrcidIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  link: LinkIcon,
} as const

export type LinkIconName = keyof typeof linkIcons

/** A Lucide icon as data: each element's tag and attributes, on Lucide's 24px grid. */
export type LucideIconNode = Array<[tag: string, attrs: Record<string, string>]>

/** Draws a Lucide icon in the same frame and stroke as the glyphs above. */
export const LucideGlyph = ({ node, ...props }: IconProps & { node: LucideIconNode }) => (
  <Glyph {...props}>{node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}</Glyph>
)
