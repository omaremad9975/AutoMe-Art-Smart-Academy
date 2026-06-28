import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { createHmac } from 'crypto'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Signs a student session token with HMAC-SHA256 so it cannot be forged
function createSignedToken(email) {
  const exp     = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  const payload = `${email}:${exp}`
  const sig     = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY).update(payload).digest('hex')
  return Buffer.from(JSON.stringify({ email, exp, sig })).toString('base64url')
}

// POST { email, code }
// Returns { token } — HMAC-signed token the client stores in localStorage
export async function POST(request) {
  try {
    // Rate limit: 10 attempts per IP per 15 minutes
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
              || request.headers.get('x-real-ip')
              || 'unknown'
    const { allowed } = rateLimit({ key: `student-verify-otp:${ip}`, limit: 10, windowMs: 15 * 60 * 1000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait 15 minutes.' }, { status: 429 })
    }

    const { email, code } = await request.json()
    if (!email || !code) return NextResponse.json({ error: 'Email and code required' }, { status: 400 })

    const cleanEmail = email.toLowerCase().trim()

    const { data: otp } = await supabaseAdmin
      .from('student_otps')
      .select('*')
      .eq('email', cleanEmail)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!otp) {
      return NextResponse.json({ error: 'الرمز غير صحيح أو انتهت صلاحيته' }, { status: 401 })
    }

    // Mark OTP as used
    await supabaseAdmin
      .from('student_otps')
      .update({ used: true })
      .eq('id', otp.id)

    // Generate HMAC-signed token — cannot be forged without the server secret
    const token = createSignedToken(cleanEmail)

    return NextResponse.json({ success: true, token, email: cleanEmail })

  } catch (err) {
    console.error('[student/verify-otp] unexpected:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
