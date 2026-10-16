import { type NextRequest, NextResponse } from 'next/server'

/**
 * Tells the admin which page is being requested. payload-totp's admin provider reads
 * `x-pathname` to decide whether to send a signed-in user to the code or setup screen, and
 * without it, it redirects in a loop. It is set on the request, which is what server
 * components read on Vercel as well as `next start`, and it replaces any value the browser sent.
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers } })
}

// Only the admin needs it, so the public pages don't run it.
export const config = {
  matcher: '/admin/:path*',
}
