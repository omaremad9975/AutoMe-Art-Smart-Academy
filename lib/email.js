import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ── From address ───────────────────────────────────────────────────────────────
// While testing: use onboarding@resend.dev (works without domain verification)
// In production: change to noreply@yourdomain.com after verifying in Resend dashboard
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Art Smart Academy <onboarding@resend.dev>'

// ── Helpers ────────────────────────────────────────────────────────────────────
function methodLabel(method) {
  return { fawry: 'Card (Visa / Mastercard)', vodafone_cash: 'Vodafone Cash', instapay: 'InstaPay' }[method] || method
}

// ── HTML Email Template ────────────────────────────────────────────────────────
function buildEmailHtml({ studentName, courseName, coursePrice, paymentMethod, registrationId, academyPhone, academyEmail, isConfirmed, whatsappGroupUrl, paymentReference, transactionId }) {
  const method = methodLabel(paymentMethod)
  const shortId = registrationId ? registrationId.toString().slice(0, 8).toUpperCase() : '--------'
  // Ref shown to student: admin-entered ref for manual payments, Fawry TXN ID if available, else registration shortId
  const displayRef = paymentReference || transactionId || shortId

  const paymentInstructionsAr = {
    fawry:         `سيتم تحصيل رسوم التسجيل عبر البطاقة البنكية (Visa / Mastercard). سيتواصل معك فريقنا بتفاصيل الدفع قريباً.`,
    vodafone_cash: `يُرجى إرسال المبلغ <strong>${coursePrice} جنيه</strong> عبر فودافون كاش إلى رقم الأكاديمية، ثم أرسل صورة الإيصال عبر واتساب وسيتم تأكيد تسجيلك خلال 24 ساعة.`,
    instapay:      `يُرجى إرسال المبلغ <strong>${coursePrice} جنيه</strong> عبر InstaPay إلى حساب الأكاديمية، ثم أرسل صورة الإيصال عبر واتساب وسيتم تأكيد تسجيلك خلال 24 ساعة.`,
  }

  const paymentInstructionsEn = {
    fawry:         `Your registration fee will be paid by card (Visa / Mastercard). Our team will contact you with payment details shortly.`,
    vodafone_cash: `Please send <strong>${coursePrice} EGP</strong> via Vodafone Cash to the academy number, then send a screenshot via WhatsApp. Your registration will be confirmed within 24 hours.`,
    instapay:      `Please send <strong>${coursePrice} EGP</strong> via InstaPay to the academy account, then send a screenshot via WhatsApp. Your registration will be confirmed within 24 hours.`,
  }

  const statusBadgeAr = isConfirmed ? '✅ تم التأكيد' : '⏳ في الانتظار'
  const statusBadgeEn = isConfirmed ? '✅ Confirmed' : '⏳ Pending Payment'
  const statusColor   = isConfirmed ? '#10B981' : '#F59E0B'

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>تأكيد التسجيل — أرت سمارت اكاديمي</title>
</head>
<body style="margin:0;padding:0;background:#FFF8F4;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #FFE4D4;box-shadow:0 8px 40px rgba(255,92,26,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#FF5C1A,#FF7A40);padding:36px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.7);text-transform:uppercase;">ART SMART ACADEMY</p>
            <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;color:#FFFFFF;">
              ${isConfirmed ? '🎉 تم تأكيد تسجيلك!' : '📋 تم استلام طلبك!'}
            </h1>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.85);">
              ${isConfirmed ? 'Your registration is confirmed' : 'We received your registration request'}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">

            <!-- Greeting -->
            <p style="margin:0 0 24px;font-size:17px;font-weight:700;color:#1A1A1A;direction:rtl;">
              مرحباً ${studentName}، 👋
            </p>
            <p style="margin:0 0 28px;font-size:14px;color:#6B6B6B;line-height:1.7;direction:rtl;">
              ${isConfirmed
                ? `يسعدنا إعلامك بأن تسجيلك في كورس <strong style="color:#FF5C1A;">${courseName}</strong> قد تم تأكيده بنجاح. نتطلع لرؤيتك معنا!`
                : `شكراً لتسجيلك في كورس <strong style="color:#FF5C1A;">${courseName}</strong>. يُرجى اتباع تعليمات الدفع أدناه لاستكمال تسجيلك.`
              }
            </p>

            <!-- Registration Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F4;border-radius:14px;border:1px solid #FFE4D4;margin-bottom:28px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid #FFE4D4;">
                  <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:2px;color:#A0A0A0;text-transform:uppercase;">REGISTRATION DETAILS</p>
                </td>
              </tr>
              <tr>
                <td style="padding:4px 0;">
                  ${row('📚 الكورس / Course',    courseName)}
                  ${row('💳 طريقة الدفع / Payment', method)}
                  ${row('💰 الرسوم / Fee',          coursePrice ? `${coursePrice} جنيه` : '—')}
                  ${row('🔖 رقم التسجيل / Ref',     `#${displayRef}`)}
                  ${statusRow(statusBadgeAr, statusBadgeEn, statusColor)}
                </td>
              </tr>
            </table>

            <!-- Payment Instructions (only for pending) -->
            ${!isConfirmed ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3CD;border-radius:12px;border:1px solid #FFD97A;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#92600A;direction:rtl;">⚡ خطوات إتمام الدفع</p>
                  <p style="margin:0;font-size:13px;color:#78540A;line-height:1.7;direction:rtl;">
                    ${paymentInstructionsAr[paymentMethod] || ''}
                  </p>
                  <hr style="border:none;border-top:1px solid #FFD97A;margin:14px 0;" />
                  <p style="margin:0;font-size:12px;color:#92600A;line-height:1.6;">
                    ${paymentInstructionsEn[paymentMethod] || ''}
                  </p>
                </td>
              </tr>
            </table>
            ` : `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#D1FAE5;border-radius:12px;border:1px solid #6EE7B7;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#065F46;direction:rtl;">✅ تسجيلك مؤكد!</p>
                  <p style="margin:0;font-size:13px;color:#047857;line-height:1.7;direction:rtl;">
                    سيتواصل معك فريق الأكاديمية قريباً بتفاصيل موعد بدء الكورس ومكانه.
                  </p>
                  <p style="margin:8px 0 0;font-size:12px;color:#065F46;">
                    Our team will contact you soon with course schedule and location details.
                  </p>
                </td>
              </tr>
            </table>
            ${whatsappGroupUrl ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FFF4;border-radius:12px;border:1px solid #86EFAC;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#15803D;direction:rtl;">💬 انضم إلى مجموعة الكورس على واتساب</p>
                  <p style="margin:0 0 16px;font-size:12px;color:#166534;direction:rtl;">ستجد فيها كل التفاصيل والتحديثات والتواصل مع زملائك</p>
                  <a href="${whatsappGroupUrl}" target="_blank" style="display:inline-block;background:#25D366;color:#FFFFFF;font-size:13px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
                    📲 انضم للمجموعة الآن
                  </a>
                  <p style="margin:14px 0 0;font-size:11px;color:#166534;">Join the WhatsApp group for course updates and coordination</p>
                </td>
              </tr>
            </table>
            ` : ''}
            `}

            <!-- Contact -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #FFE4D4;padding-top:24px;margin-top:4px;">
              <tr>
                <td style="padding-top:20px;">
                  <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1A1A1A;direction:rtl;">هل لديك سؤال؟ تواصل معنا</p>
                  <p style="margin:0 0 6px;font-size:13px;color:#6B6B6B;">📞 ${academyPhone || '+20 100 000 0000'}</p>
                  <p style="margin:0;font-size:13px;color:#6B6B6B;">✉️ ${academyEmail || 'info@artsmartacademy.com'}</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FFF8F4;border-top:1px solid #FFE4D4;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#A0A0A0;">
              © ${new Date().getFullYear()} Art Smart Academy · أرت سمارت اكاديمي
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

// ── Table row helpers ──────────────────────────────────────────────────────────
function row(label, value) {
  return `<tr>
    <td style="padding:10px 24px;border-bottom:1px solid #FFE4D4;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:12px;color:#A0A0A0;width:50%;direction:rtl;">${label}</td>
        <td style="font-size:13px;font-weight:600;color:#1A1A1A;text-align:left;">${value || '—'}</td>
      </tr></table>
    </td>
  </tr>`
}

function statusRow(ar, en, color) {
  return `<tr>
    <td style="padding:10px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:12px;color:#A0A0A0;width:50%;direction:rtl;">📌 الحالة / Status</td>
        <td style="text-align:left;">
          <span style="display:inline-block;background:${color}22;color:${color};font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid ${color}44;">
            ${ar} · ${en}
          </span>
        </td>
      </tr></table>
    </td>
  </tr>`
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Send a confirmation email to the student.
 * @param {object} opts
 * @param {string} opts.studentName
 * @param {string} opts.studentEmail
 * @param {string} opts.courseName
 * @param {string|number} opts.coursePrice
 * @param {string} opts.paymentMethod   - fawry | vodafone_cash | instapay
 * @param {string} opts.registrationId
 * @param {string} [opts.academyPhone]
 * @param {string} [opts.academyEmail]
 * @param {boolean} opts.isConfirmed    - true = full confirmation email, false = pending/payment-instructions email
 */
export async function sendRegistrationEmail(opts) {
  const { studentEmail, studentName, courseName, isConfirmed } = opts

  const subjectAr = isConfirmed
    ? `✅ تم تأكيد تسجيلك في ${courseName}`
    : `📋 تم استلام طلب تسجيلك في ${courseName}`

  const html = buildEmailHtml(opts)

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to:   studentEmail,
      subject: subjectAr,
      html,
    })
    if (error) {
      console.error('[email] Resend error:', error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (err) {
    console.error('[email] Unexpected error:', err)
    return { success: false, error: err.message }
  }
}
