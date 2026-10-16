import type { Metadata } from 'next'
import Link from 'next/link'

import { CvDocument } from '@/components/cv/CvDocument'
import { PrintButton } from '@/components/cv/PrintButton'
import { ArrowLeft, DownloadIcon } from '@/components/icons'
import { getContent } from '@/lib/content'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const { profile, cv } = await getContent()
  const title = `Curriculum vitae · ${profile.name}`
  const description = `Academic CV of ${profile.name}: education, coursework, publications, experience and skills.`
  return {
    title: 'Curriculum vitae',
    description,
    alternates: { canonical: '/cv' },
    // Inherit the site-wide robots rules unless the CV is hidden from search engines.
    ...(cv.allowIndexing === false ? { robots: { index: false, follow: true } } : {}),
    openGraph: { type: 'profile', url: `${siteUrl}/cv`, siteName: profile.name, title, description, locale: 'en_US' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CvPage() {
  const content = await getContent()

  return (
    <div className="cv-page theme-light">
      <nav className="cv-toolbar" aria-label="CV actions">
        <Link className="pill" href="/">
          <ArrowLeft />
          nimish-jain.com
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <PrintButton />
          {Boolean(content.cv.pdf) && (
            <a className="btn" href="/cv.pdf" download="Nimish-Jain-CV.pdf">
              <DownloadIcon className="btn-icon" />
              Download PDF
            </a>
          )}
        </div>
      </nav>
      <main>
        <CvDocument content={content} />
      </main>
    </div>
  )
}
