import { NextResponse } from 'next/server'
import { sendRegistrationEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Strip HTML tags and limit length — prevents XSS in stored/displayed data
function sanitize(value, maxLen = 300) {
  return String(value || '').replace(/<[^>]*>/g, '').trim().slice(0, maxLen)
}

// In-memory settings cache — academy phone/email almost never change,
// no need to hit the DB on every registration submission.
let settingsCache = null
let settingsCacheAt = 0
const SETTINGS_TTL = 5 * 60 * 1000 // 5 minutes

async function getAcademySettings() {
  if (settingsCache && Date.now() - settingsCacheAt < SETTINGS_TTL) {
    return settingsCache
  }
  const { data } = await supabaseAdmin.from('settings').select('key, value').in('key', ['phone', 'email'])
  const map = {}
  ;(data || []).forEach((s) => { map[s.key] = s.value })
  settingsCache  = map
  settingsCacheAt = Date.now()
  return map
}

export async function POST(request) {
  try {
    // Rate limit: 5 registrations per IP per 10 minutes
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
              || request.headers.get('x-real-ip')
              || 'unknown'
    const { allowed } = rateLimit({ key: `register:${ip}`, limit: 5, windowMs: 10 * 60 * 1000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a few minutes.' }, { status: 429 })
    }

    const body = await request.json()

    // ── Sanitize all text inputs ───────────────────────────────────────────────
    const name          = sanitize(body.name, 200)
    const phone         = sanitize(body.phone, 30)
    const email         = sanitize(body.email, 200).toLowerCase()
    const whatsapp      = sanitize(body.whatsapp, 30)
    const courseId      = parseInt(body.courseId, 10)
    const paymentMethod = sanitize(body.paymentMethod, 50)
    const receiptUrl    = body.receiptUrl ? sanitize(body.receiptUrl, 1000) : null

    // ── Validate ───────────────────────────────────────────────────────────────
    if (!name || !phone || !email || !courseId || !paymentMethod) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
    }
    if (isNaN(courseId) || courseId <= 0) {
      return NextResponse.json({ error: 'Invalid course selected' }, { status: 400 })
    }
    // Receipt is required for manual payment methods
    const manualMethods = ['vodafone_cash', 'instapay']
    if (manualMethods.includes(paymentMethod) && !receiptUrl) {
      return NextResponse.json({ error: 'Receipt screenshot is required for this payment method' }, { status: 400 })
    }
    // Validate receiptUrl is from our own Supabase storage — reject external URLs
    if (receiptUrl) {
      const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '')
      const isOwnStorage = receiptUrl.startsWith(`https://${supabaseHost}/storage/v1/object/`)
      if (!isOwnStorage) {
        return NextResponse.json({ error: 'Invalid receipt URL' }, { status: 400 })
      }
    }
    const validMethods = ['fawry', 'vodafone_cash', 'instapay']
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Fawry auto-confirms; others start as pending
    const isFawry = paymentMethod === 'fawry'
    const paymentStatus = isFawry ? 'confirmed' : 'pending'

    // ── Insert registration ────────────────────────────────────────────────────
    const { data: reg, error: regError } = await supabaseAdmin
      .from('registrations')
      .insert([{
        student_name:   name,
        phone,
        email,
        whatsapp:       whatsapp || phone, // default to phone if same
        course_id:      courseId,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        receipt_url:    receiptUrl || null,
      }])
      .select()
      .single()

    if (regError) {
      console.error('[register] DB error:', regError)
      return NextResponse.json({ error: 'Could not save registration. Please try again.' }, { status: 500 })
    }

    // ── Fetch course details for email ─────────────────────────────────────────
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('name_ar, name_en, price')
      .eq('id', courseId)
      .single()

    // ── Fetch academy settings (cached — avoids a DB hit on every registration) ─
    const settingsMap = await getAcademySettings()

    const courseName  = course?.name_ar || course?.name_en || 'الكورس'
    const coursePrice = course?.price ? `${course.price}` : ''

    // ── Send email ─────────────────────────────────────────────────────────────
    // Manual payments (vodafone_cash, instapay): NO email on registration.
    // The confirmation email is sent only when an admin confirms payment.
    // Fawry: send immediately (auto-confirmed).
    if (isFawry) {
      await sendRegistrationEmail({
        studentName:    name,
        studentEmail:   email,
        courseName,
        coursePrice,
        paymentMethod,
        registrationId: reg.id,
        academyPhone:   settingsMap.phone,
        academyEmail:   settingsMap.email,
        isConfirmed:    true,
      })
    }

    return NextResponse.json({
      success: true,
      registrationId: reg.id,
      paymentStatus,
    })

  } catch (err) {
    console.error('[register] Unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
