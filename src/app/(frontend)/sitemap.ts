import type { MetadataRoute } from 'next'

import { getContent } from '@/lib/content'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { profile, cv } = await getContent()
  const lastModified = profile.updatedAt ? new Date(profile.updatedAt) : new Date()

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...(cv.allowIndexing === false
      ? []
      : [{ url: `${siteUrl}/cv`, lastModified, changeFrequency: 'monthly' as const, priority: 0.8 }]),
  ]
}
