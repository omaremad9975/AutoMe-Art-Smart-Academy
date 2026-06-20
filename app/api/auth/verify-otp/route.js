import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// POST { email, code }
// Verifies the OTP — returns success so client can complete signInWithPassword
export async function POST(request) {
  try {
    const { email, code } = await request.json()
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    // ── Find latest valid code for this email ──────────────────────────────────
    const { data: otp, error } = await supabaseAdmin
      .from('login_otps')
      .select('*')
      .eq('email', email)
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

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[verify-otp]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
