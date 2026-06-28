import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect all /dashboard/* routes server-side
  // The client-side Supabase session check remains as a second layer
  if (pathname.startsWith('/dashboard')) {
    const adminCookie = request.cookies.get('asa_admin')
    if (!adminCookie || adminCookie.value !== '1') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
