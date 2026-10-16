import { servePdf } from '@/lib/serve-pdf'

// Looked up on each request, so a newly uploaded PDF is served straight away.
export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  // The PDF is uploaded under Site → Resume. Until it is, the CV page stands in for it.
  return servePdf(request, { global: 'resume', filename: 'Nimish-Jain-Resume.pdf', fallback: '/cv' })
}
