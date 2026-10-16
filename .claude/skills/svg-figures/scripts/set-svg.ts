/**
 * Puts a drawing into a publication's figure or a project's preview in the LOCAL database, finding the
 * entry by (part of) its title. Run it through Payload, which loads .env and the config:
 *
 *   pnpm payload run .claude/skills/svg-figures/scripts/set-svg.ts publications "Fully Homomorphic" drawing.svg
 *   pnpm payload run .claude/skills/svg-figures/scripts/set-svg.ts projects "Riddler" drawing.svg
 *
 * It refuses any database that isn't on this machine: production content changes through the live
 * admin, where saving also refreshes the published pages.
 */
import { readFileSync } from 'node:fs'

import { getPayload } from 'payload'

import config from '../../../../src/payload.config'

const FIELDS = { publications: 'figureSvg', projects: 'previewSvg' } as const
type Collection = keyof typeof FIELDS

// `payload run` passes [node, payload's bin.js, ...arguments], without this script's own path.
const rest = process.argv.slice(2).filter((arg) => arg !== '--' && !arg.endsWith('set-svg.ts'))
const [collection, title, file] = rest as [Collection, string, string]
if (!(collection in FIELDS) || !title || !file) {
  console.error('Usage: pnpm payload run .claude/skills/svg-figures/scripts/set-svg.ts publications|projects "<part of the title>" <file.svg>')
  process.exit(2)
}

if (!/@(localhost|127\.0\.0\.1|0\.0\.0\.0)[:/]/.test(process.env.DATABASE_URL ?? '')) {
  console.error('DATABASE_URL is not a local database. Change production content in its admin instead.')
  process.exit(1)
}

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection, where: { title: { like: title } }, limit: 10, depth: 0 })
if (docs.length !== 1) {
  console.error(
    docs.length
      ? `"${title}" matches ${docs.length} ${collection}: ${docs.map((doc) => `"${doc.title}"`).join(', ')}. Be more specific.`
      : `No ${collection} title contains "${title}".`,
  )
  process.exit(1)
}

const field = FIELDS[collection]
const svg = readFileSync(file, 'utf8').trim()
// The field's save hook sanitises the markup and its validation rejects anything that isn't one <svg>.
try {
  const updated = await payload.update({
    collection,
    id: docs[0].id,
    data: { [field]: svg },
    context: { disableRevalidate: true },
  })
  const stored = (updated as unknown as Record<string, string | null>)[field]
  console.log(`Saved to ${collection} "${docs[0].title}" (${stored?.length ?? 0} characters stored).`)
  process.exit(0)
} catch (error) {
  console.error(`Payload refused it: ${(error as Error).message}. Run check-svg.ts on the file first.`)
  process.exit(1)
}
