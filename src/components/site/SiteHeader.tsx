import Link from 'next/link'

import { FileIcon } from '@/components/icons'

import { ThemeToggle } from './ThemeToggle'
import { Wordmark } from './Wordmark'

const NAV = [
  { href: '#research', label: 'Research' },
  { href: '#education', label: 'Education' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
]

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-[880px] flex-wrap items-center gap-x-4 gap-y-2 px-(--gutter) py-3">
        <a href="#top" className="wordmark mr-auto">
          <Wordmark name={name} />
        </a>
        <nav aria-label="Sections" className="site-nav flex items-center gap-0.5">
          {NAV.map((item) => (
            <a key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link className="pill pill-sm" href="/cv">
            <FileIcon />
            CV
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
