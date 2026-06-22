import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const resend     = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Art Smart Academy <onboarding@resend.dev>'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST { email }
export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const cleanEmail = email.toLowerCase().trim()

    // Check the student has at least one certificate issued
    const { data: cert } = await supabaseAdmin
      .from('student_certificates')
      .select('id')
      .eq('student_email', cleanEmail)
      .limit(1)
      .maybeSingle()

    if (!cert) {
      return NextResponse.json({ error: 'لا توجد شهادات مرتبطة بهذا البريد الإلكتروني.' }, { status: 404 })
    }

    // Invalidate previous unused codes
    await supabaseAdmin
      .from('student_otps')
      .update({ used: true })
      .eq('email', cleanEmail)
      .eq('used', false)

    // Insert new OTP
    const code      = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: insertErr } = await supabaseAdmin
      .from('student_otps')
      .insert([{ email: cleanEmail, code, expires_at: expiresAt }])

    if (insertErr) return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 })

    // Send email
    const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#FFF8F4;font-family:'Cairo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #FFE4D4;box-shadow:0 8px 32px rgba(255,92,26,0.10);">
        <tr>
          <td style="background:linear-gradient(135deg,#FF5C1A,#FF7A40);padding:32px;text-align:center;">
            <div style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:4px;">ART</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.80);margin-top:4px;letter-spacing:2px;">SMART ACADEMY</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#1A1A1A;font-family:'Cairo',sans-serif;">رمز الدخول لبوابة الشهادات</p>
            <p style="margin:0 0 24px;font-size:13px;color:#6B6B6B;line-height:1.6;font-family:'Cairo',sans-serif;">
              أدخل الرمز أدناه للوصول إلى شهاداتك.<br/>صالح لمدة <strong>10 دقائق</strong> فقط.
            </p>
            <div style="background:#FFF8F4;border:2px dashed #FF5C1A;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
              <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#FF5C1A;font-family:monospace;">${code}</div>
            </div>
            <p style="margin:0;font-size:12px;color:#A0A0A0;line-height:1.6;font-family:'Cairo',sans-serif;">
              إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #FFE4D4;background:#FFF8F4;text-align:center;">
            <p style="margin:0;font-size:11px;color:#C0C0C0;font-family:'Cairo',sans-serif;">© 2026 Art Smart Academy</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const emailResult = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      cleanEmail,
      subject: `${code} — رمز الدخول | Art Smart Academy`,
      html,
    })

    if (emailResult.error) {
      console.error('[student/send-otp] email error:', emailResult.error)
      return NextResponse.json({ error: 'Could not send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[student/send-otp] unexpected:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
