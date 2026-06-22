import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// POST { email, code }
// Returns { token } — a simple session token the client stores in localStorage
export async function POST(request) {
  try {
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

    // Generate a simple session token: base64(email:exp)
    // Not cryptographically secure but fine for MVP
    const exp   = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    const token = Buffer.from(JSON.stringify({ email: cleanEmail, exp })).toString('base64')

    return NextResponse.json({ success: true, token, email: cleanEmail })

  } catch (err) {
    console.error('[student/verify-otp] unexpected:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
