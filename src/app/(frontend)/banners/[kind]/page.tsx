import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Banner, BANNERS, type BannerKind } from '@/components/banner/Banner'
import { getContent } from '@/lib/content'

// Pages that `pnpm banners` screenshots into public/banners; not linked from the site.
export const dynamic = 'force-static'
export const dynamicParams = false

export const metadata: Metadata = { title: 'Banner', robots: { index: false, follow: false } }

export function generateStaticParams() {
  return Object.keys(BANNERS).map((kind) => ({ kind }))
}

export default async function BannerPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params
  if (!(kind in BANNERS)) notFound()
  const { profile, publications, projects } = await getContent()
  return <Banner kind={kind as BannerKind} profile={profile} publications={publications} projects={projects} />
}
