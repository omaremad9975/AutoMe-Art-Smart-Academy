
import { NextResponse } from 'next/server'
import { supabaseAdmin, verifyCaller } from '@/lib/supabase-admin'

// GET — list all registrations with course details
export async function GET(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('*, courses(name_ar, name_en, price, certificate_template_url), student_certificates(id, verification_code, issued_at, certificate_url)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ registrations: data || [] })
}

// PATCH — update payment_status of a single registration
export async function PATCH(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, payment_status } = await request.json()
  if (!id || !payment_status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('registrations')
    .update({ payment_status })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
