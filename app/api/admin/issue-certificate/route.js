
import { NextResponse } from 'next/server'
import { supabaseAdmin, verifyCaller } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Art Smart Academy <onboarding@resend.dev>'
const BASE_URL   = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-me-art-smart-academy-4pil0ulx2-auto-me-s-projects.vercel.app'

async function issueOne(registrationId) {
  // 1. Get registration + course info
  const { data: reg, error: regErr } = await supabaseAdmin
    .from('registrations')
    .select('*, courses(name_ar, name_en, certificate_template_url)')
    .eq('id', registrationId)
    .single()

  if (regErr || !reg) return { error: 'Registration not found' }

  // 2. Check if already issued
  const { data: existing } = await supabaseAdmin
    .from('student_certificates')
    .select('id')
    .eq('registration_id', registrationId)
    .maybeSingle()

  if (existing) return { skipped: true, id: existing.id }

  // 3. Create certificate record
  const { data: cert, error: certErr } = await supabaseAdmin
    .from('student_certificates')
    .insert({
      registration_id: registrationId,
      course_id:       reg.course_id,
      student_name:    reg.student_name,
      student_email:   reg.email,
      course_name_ar:  reg.courses?.name_ar || '',
      course_name_en:  reg.courses?.name_en || '',
      certificate_url: null, // PDF generation added later
    })
    .select()
    .single()

  if (certErr) return { error: certErr.message }

  // 4. Email the student
  const verifyUrl = `${BASE_URL}/verify/${cert.verification_code}`
  const portalUrl = `${BASE_URL}/student/my-certificates`
  const issuedDate = new Date(cert.issued_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })

  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#FFF8F4;font-family:'Cairo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #FFE4D4;box-shadow:0 8px 32px rgba(255,92,26,0.10);">
        <tr>
          <td style="background:linear-gradient(135deg,#FF5C1A,#FF7A40);padding:36px 32px;text-align:center;">
            <div style="font-size:32px;font-weight:900;color:#FFFFFF;letter-spacing:4px;font-family:Arial,sans-serif;">ART</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.80);margin-top:4px;letter-spacing:2px;">SMART ACADEMY</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="width:64px;height:64px;background:linear-gradient(135deg,#FF5C1A,#FF7A40);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="font-size:28px;">🎓</span>
              </div>
              <h2 style="color:#111827;font-size:22px;font-weight:900;margin:0 0 6px;font-family:'Cairo',sans-serif;">مبروك، ${reg.student_name}!</h2>
              <p style="color:#6B7280;font-size:13px;margin:0;font-family:'Cairo',sans-serif;">تم إصدار شهادتك بنجاح</p>
            </div>

            <div style="background:#FFF8F4;border:1.5px solid #FFE4D4;border-radius:14px;padding:20px;margin-bottom:20px;text-align:center;">
              <p style="color:#9CA3AF;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 8px;font-family:'Cairo',sans-serif;">الكورس</p>
              <p style="color:#FF5C1A;font-size:18px;font-weight:900;margin:0 0 4px;font-family:'Cairo',sans-serif;">${reg.courses?.name_ar || ''}</p>
              <p style="color:#9CA3AF;font-size:12px;margin:0;font-family:'Cairo',sans-serif;">${reg.courses?.name_en || ''}</p>
              <div style="border-top:1px solid #FFE4D4;margin:12px 0;"></div>
              <p style="color:#6B7280;font-size:12px;margin:0;font-family:'Cairo',sans-serif;">تاريخ الإصدار: <strong style="color:#111827;">${issuedDate}</strong></p>
            </div>

            <div style="display:flex;gap:10px;flex-direction:column;">
              <a href="${portalUrl}" style="display:block;background:linear-gradient(135deg,#FF5C1A,#FF7A40);color:#FFFFFF;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:14px;font-family:'Cairo',sans-serif;box-shadow:0 4px 16px rgba(255,92,26,0.30);">
                🎓 عرض شهادتك
              </a>
              <a href="${verifyUrl}" style="display:block;background:#F9FAFB;color:#6B7280;text-align:center;padding:12px;border-radius:12px;text-decoration:none;font-weight:600;font-size:12px;font-family:'Cairo',sans-serif;border:1px solid #E5E7EB;">
                🔐 رمز التحقق: ${cert.verification_code}
              </a>
            </div>

            <p style="margin:20px 0 0;font-size:11px;color:#A0A0A0;text-align:center;font-family:'Cairo',sans-serif;line-height:1.6;">
              يمكنك مشاركة هذه الشهادة مع أصحاب العمل أو على LinkedIn.<br/>
              رمز التحقق يثبت أصالة الشهادة لأي شخص.
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

  try {
    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      reg.email,
      subject: `🎓 شهادتك جاهزة — ${reg.courses?.name_ar || 'Art Smart Academy'}`,
      html,
    })
  } catch (e) {
    console.error('[issue-certificate] email error:', e)
    // Don't fail — certificate was still issued
  }

  return { success: true, cert }
}

// POST { registrationId } — issue for one student
// POST { courseId }       — issue for all confirmed students in a course
export async function POST(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { registrationId, courseId } = body

  // ── Single issue ──────────────────────────────────────────────────────────
  if (registrationId) {
    const result = await issueOne(registrationId)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json(result)
  }

  // ── Bulk issue for entire course ──────────────────────────────────────────
  if (courseId) {
    const { data: regs, error: regsErr } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('course_id', courseId)
      .eq('payment_status', 'confirmed')

    if (regsErr) return NextResponse.json({ error: regsErr.message }, { status: 500 })
    if (!regs?.length) return NextResponse.json({ issued: 0, skipped: 0 })

    let issued = 0, skipped = 0, errors = []
    for (const reg of regs) {
      const result = await issueOne(reg.id)
      if (result.error)   errors.push(result.error)
      else if (result.skipped) skipped++
      else issued++
    }

    return NextResponse.json({ issued, skipped, errors })
  }

  return NextResponse.json({ error: 'registrationId or courseId required' }, { status: 400 })
}
