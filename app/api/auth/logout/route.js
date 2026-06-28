import { NextResponse } from 'next/server'

// Clears the HttpOnly admin session cookie on logout
export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('asa_admin', '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   0,
    path:     '/',
  })
  return response
}
