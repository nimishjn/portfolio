import config from '@payload-config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'

/**
 * Responds with the PDF that a global's `pdf` field points to (an upload in Documents), or
 * redirects to `fallback` while none is set. Behind /cv.pdf and /resume.pdf, which next.config.ts
 * keeps out of search results.
 *
 * The lookup is the server's own (Local API), so it works although Documents can only be listed
 * by a signed-in user: these two routes are the public way to the files.
 */
export async function servePdf(
  request: Request,
  { global, filename, fallback }: { global: 'cv' | 'resume'; filename: string; fallback: string },
) {
  const payload = await getPayload({ config })
  const { pdf } = await payload.findGlobal({ slug: global, depth: 1 })
  const doc = pdf && typeof pdf === 'object' ? pdf : undefined
  if (!doc?.url || !doc.filename) return Response.redirect(new URL(fallback, request.url), 307)

  const body = await readPdf(doc.url, doc.filename)
  if (!body) return new Response('The PDF is unavailable.', { status: 502 })

  return new Response(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      // Checked with the server every time, so a new upload replaces the old one at once.
      'Cache-Control': 'no-cache',
      'Content-Length': String(body.byteLength),
    },
  })
}

/**
 * A Vercel Blob URL in production. In development the upload's URL is Payload's own file route,
 * which now needs a signed-in user, so the file is read from the collection's folder instead.
 */
async function readPdf(url: string, filename: string): Promise<Buffer | null> {
  if (url.startsWith('/')) {
    const dir = path.resolve('documents')
    const file = path.resolve(dir, filename)
    if (!file.startsWith(dir + path.sep)) return null
    return readFile(file).catch(() => null)
  }
  const file = await fetch(url, { cache: 'no-store' })
  if (!file.ok) return null
  return Buffer.from(await file.arrayBuffer())
}
