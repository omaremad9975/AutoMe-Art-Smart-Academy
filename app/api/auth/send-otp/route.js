import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'

// ── Two separate clients — avoids session bleed ───────────────────────────────
// Auth client (anon key) — only used to verify email+password
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Admin client (service role) — only used for DB operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const resend   = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Art Smart Academy <onboarding@resend.dev>'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST { email, password }
export async function POST(request) {
  try {
    // Rate limit: 5 attempts per IP per 15 minutes
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
              || request.headers.get('x-real-ip')
              || 'unknown'
    const { allowed } = rateLimit({ key: `send-otp:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait 15 minutes before trying again.' }, { status: 429 })
    }

    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // ── 1. Verify credentials (anon client — no session bleed) ────────────────
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Sign out immediately — we don't want an active session yet
    await supabaseAuth.auth.signOut()

    // ── 2. Check user exists in admins table (service role client) ────────────
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('admins')
      .select('role')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (adminError || !admin) {
      return NextResponse.json({ error: 'ليس لديك صلاحية الوصول' }, { status: 403 })
    }

    // ── 3. Invalidate any previous unused codes for this email ────────────────
    await supabaseAdmin
      .from('login_otps')
      .update({ used: true })
      .eq('email', email.toLowerCase().trim())
      .eq('used', false)

    // ── 4. Generate + store new code (10 min expiry) ──────────────────────────
    const code      = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: insertError } = await supabaseAdmin
      .from('login_otps')
      .insert([{ email: email.toLowerCase().trim(), code, expires_at: expiresAt }])

    if (insertError) {
      console.error('[send-otp] insert error:', insertError)
      return NextResponse.json({ error: `OTP insert failed: ${insertError.message || insertError.code || JSON.stringify(insertError)}` }, { status: 500 })
    }

    // ── 5. Send OTP email ─────────────────────────────────────────────────────
    const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#FFF8F4;font-family:'Cairo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #FFE4D4;box-shadow:0 8px 32px rgba(255,92,26,0.10);">
        <tr>
          <td style="background:linear-gradient(135deg,#FF5C1A,#FF7A40);padding:32px 32px 24px;text-align:center;">
            <div style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:4px;font-family:Arial,sans-serif;">ART</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.80);margin-top:4px;letter-spacing:2px;">SMART ACADEMY</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#1A1A1A;">رمز تسجيل الدخول</p>
            <p style="margin:0 0 24px;font-size:13px;color:#6B6B6B;line-height:1.6;">
              أدخل الرمز أدناه لإتمام تسجيل الدخول إلى لوحة التحكم.<br/>
              صالح لمدة <strong>10 دقائق</strong> فقط.
            </p>
            <div style="background:#FFF8F4;border:2px dashed #FF5C1A;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
              <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#FF5C1A;font-family:monospace;">${code}</div>
            </div>
            <p style="margin:0;font-size:12px;color:#A0A0A0;line-height:1.6;">
              إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.<br/>
              لا تشارك هذا الرمز مع أي شخص.
            </p>
          </td>
        </tr>
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

    const emailResult = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      email,
      subject: `${code} — رمز تسجيل الدخول | Art Smart Academy`,
      html,
    })

    if (emailResult.error) {
      console.error('[send-otp] email error:', emailResult.error)
      return NextResponse.json({ error: `Could not send email: ${emailResult.error.message || emailResult.error.name || JSON.stringify(emailResult.error)}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[send-otp] unexpected:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
