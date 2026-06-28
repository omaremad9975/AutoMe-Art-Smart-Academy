import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// POST { email, code }
// Verifies the OTP — returns success so client can complete signInWithPassword
export async function POST(request) {
  try {
    // Rate limit: 10 attempts per IP per 15 minutes
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
              || request.headers.get('x-real-ip')
              || 'unknown'
    const { allowed } = rateLimit({ key: `verify-otp:${ip}`, limit: 10, windowMs: 15 * 60 * 1000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait 15 minutes.' }, { status: 429 })
    }

    const { email, code } = await request.json()
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    // ── Find latest valid code for this email ──────────────────────────────────
    const { data: otp, error } = await supabaseAdmin
      .from('login_otps')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !otp) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 })
    }

    // ── Mark code as used ──────────────────────────────────────────────────────
    await supabaseAdmin
      .from('login_otps')
      .update({ used: true })
      .eq('id', otp.id)

    // ── Set HttpOnly cookie — middleware uses this to protect /dashboard ────────
    const response = NextResponse.json({ success: true })
    response.cookies.set('asa_admin', '1', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   60 * 60 * 8, // 8 hours
      path:     '/',
    })
    return response

  } catch (err) {
    console.error('[verify-otp]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
