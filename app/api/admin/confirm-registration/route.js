import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendRegistrationEmail } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request) {
  try {
    // ── 1. Verify caller is an authenticated admin ─────────────────────────────
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const { data: { user: caller }, error: tokenError } = await supabaseAdmin.auth.getUser(token)
    if (tokenError || !caller) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: callerAdmin } = await supabaseAdmin
      .from('admins')
      .select('role')
      .eq('email', caller.email)
      .single()

    if (!callerAdmin || callerAdmin.role === 'marketing') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // ── 2. Parse request ───────────────────────────────────────────────────────
    const { registrationId, paymentReference } = await request.json()
    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId is required' }, { status: 400 })
    }

    // ── 3. Load registration ───────────────────────────────────────────────────
    const { data: reg, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('*, courses(name_ar, name_en, price, whatsapp_group_url)')
      .eq('id', registrationId)
      .single()

    if (fetchError || !reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    if (reg.payment_status === 'confirmed') {
      return NextResponse.json({ error: 'Already confirmed' }, { status: 409 })
    }

    // Fawry is auto-confirmed — should never reach this endpoint but guard anyway
    if (reg.payment_method === 'fawry') {
      return NextResponse.json({ error: 'Fawry registrations are auto-confirmed' }, { status: 400 })
    }

    // ── 4. Update status to confirmed + save reference ────────────────────────
    const updatePayload = { payment_status: 'confirmed' }
    if (paymentReference) updatePayload.payment_reference = paymentReference

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update(updatePayload)
      .eq('id', registrationId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // ── 5. Fetch academy settings for the email footer ─────────────────────────
    const { data: settings } = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', ['phone', 'email'])

    const settingsMap = {}
    settings?.forEach((s) => { settingsMap[s.key] = s.value })

    // ── 6. Send confirmation email ─────────────────────────────────────────────
    const courseName  = reg.courses?.name_ar || reg.courses?.name_en || 'الكورس'
    const coursePrice = reg.courses?.price ? `${reg.courses.price}` : ''

    const emailResult = await sendRegistrationEmail({
      studentName:       reg.student_name,
      studentEmail:      reg.email,
      courseName,
      coursePrice,
      paymentMethod:     reg.payment_method,
      registrationId:    reg.id,
      academyPhone:      settingsMap.phone,
      academyEmail:      settingsMap.email,
      isConfirmed:       true,
      whatsappGroupUrl:  reg.courses?.whatsapp_group_url || null,
    })

    if (!emailResult.success) {
      // Still return success for the DB update, but note the email failed
      console.error('[confirm-registration] Email send failed:', emailResult.error)
      return NextResponse.json({
        success: true,
        emailSent: false,
        emailError: 'Registration confirmed but confirmation email could not be sent.',
      })
    }

    return NextResponse.json({ success: true, emailSent: true })

  } catch (err) {
    console.error('[confirm-registration] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
