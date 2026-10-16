import { MailIcon } from '@/components/icons'
import { formatMonthYear } from '@/lib/format'
import type { Profile } from '@/payload-types'

import { LocalClock } from './LocalClock'
import { ProfileLinkIcon } from './ProfileLinkIcon'

export function SiteFooter({ profile }: { profile: Profile }) {
  const year = new Date(profile.lastUpdated).getUTCFullYear()

  return (
    <footer className="relative mt-24 pt-8 pb-10 before:absolute before:inset-x-[calc(-1*var(--gutter))] before:top-0 before:h-px before:bg-line max-sm:mt-16">
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6">
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em]">{profile.name}</p>
          <p className="mt-0.5 font-mono text-xs text-muted">Last updated {formatMonthYear(profile.lastUpdated, 'long')}</p>
        </div>
        <div className="flex flex-col items-end gap-3 max-sm:items-start">
          <ul className="flex gap-2">
            <li>
              <a className="icon-btn" href={`mailto:${profile.email}`} aria-label="Email">
                <MailIcon size={16} />
              </a>
            </li>
            {profile.links?.map((link) => (
              <li key={link.id ?? link.url}>
                <a className="icon-btn" href={link.url} aria-label={link.label} rel="me">
                  <ProfileLinkIcon icon={link.icon} size={16} />
                </a>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="live live-still" aria-hidden="true" />
            India · <LocalClock /> IST
          </p>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-dashed border-line pt-5 text-[13px] text-muted">
        <a className="lnk" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <span className="font-mono text-xs">© {year} · Built with Next.js and Payload CMS</span>
      </div>
    </footer>
  )
}
