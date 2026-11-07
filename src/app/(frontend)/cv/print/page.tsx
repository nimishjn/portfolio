import config from '@payload-config'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { AutoPrint } from '@/components/cv/AutoPrint'
import { CvDocument } from '@/components/cv/CvDocument'
import { getContent } from '@/lib/content'

// Rendered from the database on every request, unlike the cached /cv, so a PDF saved from it
// always has the latest content. Only the signed-in admin can open it (it links here from
// Site → CV); everyone else gets a 404.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent()
  // Chrome offers the title as the PDF's file name.
  return { title: { absolute: `${profile.name} CV` }, robots: { index: false, follow: false } }
}

type Props = { searchParams: Promise<{ full?: string }> }

export default async function CvPrintPage({ searchParams }: Props) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  // `_strategy` is set at runtime by the auth strategy that accepted the request; 'totp' means
  // the second factor was entered for this session.
  if ((user as { _strategy?: string } | null)?._strategy !== 'totp') notFound()

  // ?full=1 adds the phone number, date of birth and nationality: the copy to send with an
  // application, never the one uploaded to the site.
  const personal = (await searchParams).full === '1'
  const content = await getContent()

  return (
    <div className="cv-page theme-light">
      <p className="cv-toolbar">
        {personal
          ? 'Full CV with personal details. Save as PDF with Headers and footers turned off, and send this file directly; don’t upload it to the site.'
          : 'Public CV. Save as PDF with Headers and footers turned off, then upload the file under Site → CV.'}
      </p>
      <main>
        <CvDocument content={content} personal={personal} />
      </main>
      <AutoPrint />
    </div>
  )
}
