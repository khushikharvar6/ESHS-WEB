import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that should NEVER be redirected or blocked
const PUBLIC_PATHS = ['/f/', '/api/feedback', '/api/patients']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all public paths through without any checks
  for (const publicPath of PUBLIC_PATHS) {
    if (pathname.startsWith(publicPath)) {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
