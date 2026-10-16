/**
 * Replaces all site content with the data in ./data.ts. Users and media are left alone.
 *
 *   pnpm seed
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import * as data from './data'

const payload = await getPayload({ config })
const context = { disableRevalidate: true }

const collections = {
  publications: data.publications,
  experiences: data.experiences,
  education: data.education,
  courses: data.courses,
  projects: data.projects,
  service: data.service,
  writing: data.writing,
} as const

for (const [slug, docs] of Object.entries(collections) as Array<[keyof typeof collections, unknown[]]>) {
  await payload.delete({ collection: slug, where: { id: { exists: true } }, context })
  for (const doc of docs) {
    await payload.create({ collection: slug, data: doc as never, context })
  }
  payload.logger.info(`Seeded ${docs.length} ${slug}`)
}

await payload.updateGlobal({ slug: 'profile', data: data.profile, context })
await payload.updateGlobal({ slug: 'cv', data: data.cv, context })
payload.logger.info('Seeded profile and CV globals')

process.exit(0)
