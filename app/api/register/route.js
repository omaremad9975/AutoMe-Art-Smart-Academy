import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendRegistrationEmail } from '@/lib/email'

// Service-role client — bypasses RLS so we can reliably insert + read settings
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, phone, email, whatsapp, courseId, paymentMethod, receiptUrl } = body

    // ── Validate ───────────────────────────────────────────────────────────────
    if (!name || !phone || !email || !courseId || !paymentMethod) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
    }
    // Receipt is required for manual payment methods
    const manualMethods = ['vodafone_cash', 'instapay']
    if (manualMethods.includes(paymentMethod) && !receiptUrl) {
      return NextResponse.json({ error: 'Receipt screenshot is required for this payment method' }, { status: 400 })
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

    // ── Fetch academy settings for email footer ────────────────────────────────
    const { data: settings } = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', ['phone', 'email'])

    const settingsMap = {}
    settings?.forEach((s) => { settingsMap[s.key] = s.value })

    const courseName  = course?.name_ar || course?.name_en || 'الكورس'
    const coursePrice = course?.price ? `${course.price}` : ''

    // ── Send email ─────────────────────────────────────────────────────────────
    // For Fawry: send immediately with payment instructions (confirmed = false so
    // we include the Fawry outlet instructions, not the "you're in!" message)
    // The "fully confirmed" email is the same flow but visually says "confirmed"
    await sendRegistrationEmail({
      studentName:    name,
      studentEmail:   email,
      courseName,
      coursePrice,
      paymentMethod,
      registrationId: reg.id,
      academyPhone:   settingsMap.phone,
      academyEmail:   settingsMap.email,
      isConfirmed:    isFawry, // Fawry gets "confirmed" styling since no manual step needed
    })

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
