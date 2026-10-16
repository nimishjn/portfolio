import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Responds with the PDF that a global's `pdf` field points to (an upload in Documents), or
 * redirects to `fallback` while none is set. Behind /cv.pdf and /resume.pdf, which next.config.ts
 * keeps out of search results.
 */
export async function servePdf(
  request: Request,
  { global, filename, fallback }: { global: 'cv' | 'resume'; filename: string; fallback: string },
) {
  const payload = await getPayload({ config })
  const { pdf } = await payload.findGlobal({ slug: global, depth: 1 })
  const fileUrl = pdf && typeof pdf === 'object' ? pdf.url : undefined
  if (!fileUrl) return Response.redirect(new URL(fallback, request.url), 307)

  // A Vercel Blob URL in production, the local file route in development.
  const file = await fetch(new URL(fileUrl, request.url), { cache: 'no-store' })
  if (!file.ok || !file.body) return new Response('The PDF is unavailable.', { status: 502 })
  const length = file.headers.get('content-length')

  return new Response(file.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      // Checked with the server every time, so a new upload replaces the old one at once.
      'Cache-Control': 'no-cache',
      ...(length ? { 'Content-Length': length } : {}),
    },
  })
}
