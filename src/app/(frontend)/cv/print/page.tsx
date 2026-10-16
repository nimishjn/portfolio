import type { Metadata } from 'next'

import { AutoPrint } from '@/components/cv/AutoPrint'
import { CvDocument } from '@/components/cv/CvDocument'
import { getContent } from '@/lib/content'

// Rendered from the database on every request, unlike the cached /cv, so a PDF saved from it
// always has the latest content. The admin links here from Site → CV.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent()
  // Chrome offers the title as the PDF's file name.
  return { title: { absolute: `${profile.name} CV` }, robots: { index: false, follow: false } }
}

export default async function CvPrintPage() {
  const content = await getContent()

  return (
    <div className="cv-page theme-light">
      <p className="cv-toolbar">Save as PDF with Headers and footers turned off, then upload the file under Site → CV.</p>
      <main>
        <CvDocument content={content} />
      </main>
      <AutoPrint />
    </div>
  )
}
