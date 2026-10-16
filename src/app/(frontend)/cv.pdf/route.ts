import { servePdf } from '@/lib/serve-pdf'

// Looked up on each request, so a newly uploaded PDF is served straight away.
export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  // The PDF is chosen under Site → CV. Until one is, the page is the next best thing.
  return servePdf(request, { global: 'cv', filename: 'Nimish-Jain-CV.pdf', fallback: '/cv' })
}
