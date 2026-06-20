import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Art Smart Academy <onboarding@resend.dev>'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST { email, password }
// Verifies credentials, generates OTP, sends email — does NOT return a session
export async function POST(request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // ── 1. Verify credentials via Supabase Auth ────────────────────────────────
    // We sign in to verify password, then immediately sign out server-side
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      // Don't reveal whether email or password was wrong
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // ── 2. Check user is an admin ──────────────────────────────────────────────
    const { data: admin } = await supabaseAdmin
      .from('admins')
      .select('role')
      .eq('email', email)
      .single()

    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Invalidate the session immediately — we don't want them logged in yet
    await supabaseAdmin.auth.admin.signOut(authData.session.access_token)

    // ── 3. Invalidate any previous unused codes for this email ─────────────────
    await supabaseAdmin
      .from('login_otps')
      .update({ used: true })
      .eq('email', email)
      .eq('used', false)

    // ── 4. Generate + store new code (expires in 10 minutes) ──────────────────
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: insertError } = await supabaseAdmin
      .from('login_otps')
      .insert([{ email, code, expires_at: expiresAt }])

    if (insertError) {
      return NextResponse.json({ error: 'Could not generate code' }, { status: 500 })
    }

    // ── 5. Send OTP email via Resend ───────────────────────────────────────────
    const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#FFF8F4;font-family:'Cairo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #FFE4D4;box-shadow:0 8px 32px rgba(255,92,26,0.10);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#FF5C1A,#FF7A40);padding:32px 32px 24px;text-align:center;">
            <div style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:4px;font-family:Arial,sans-serif;">ART</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.80);margin-top:4px;letter-spacing:2px;">SMART ACADEMY</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#1A1A1A;">رمز تسجيل الدخول</p>
            <p style="margin:0 0 24px;font-size:13px;color:#6B6B6B;line-height:1.6;">
              أدخل الرمز أدناه لإتمام تسجيل الدخول إلى لوحة التحكم.<br/>
              صالح لمدة <strong>10 دقائق</strong> فقط.
            </p>
            <!-- OTP Code -->
            <div style="background:#FFF8F4;border:2px dashed #FF5C1A;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
              <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#FF5C1A;font-family:monospace;">${code}</div>
            </div>
            <p style="margin:0;font-size:12px;color:#A0A0A0;line-height:1.6;">
              إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.<br/>
              لا تشارك هذا الرمز مع أي شخص.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #FFE4D4;background:#FFF8F4;text-align:center;">
            <p style="margin:0;font-size:11px;color:#C0C0C0;">© 2026 Art Smart Academy — Admin Access Only</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      email,
      subject: `${code} — رمز تسجيل الدخول | Art Smart Academy`,
      html,
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[send-otp]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
