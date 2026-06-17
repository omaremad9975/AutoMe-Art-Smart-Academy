import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function verifyCaller(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return null
  const { data: admin } = await supabaseAdmin.from('admins').select('role').eq('email', user.email).single()
  if (!admin || admin.role === 'marketing') return null
  return admin
}

// GET — list all courses
export async function GET(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ courses: data })
}

// POST — create course
export async function POST(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name_ar, name_en, price, duration, seats, is_active } = body

  if (!name_ar || !name_en) return NextResponse.json({ error: 'Arabic and English names are required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('courses')
    .insert([{ name_ar, name_en, price: parseFloat(price) || 0, duration: duration || '', seats: parseInt(seats) || 0, is_active: is_active ?? true }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ course: data })
}

// PATCH — update course
export async function PATCH(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const payload = {}
  if (fields.name_ar  !== undefined) payload.name_ar   = fields.name_ar
  if (fields.name_en  !== undefined) payload.name_en   = fields.name_en
  if (fields.price    !== undefined) payload.price      = parseFloat(fields.price) || 0
  if (fields.duration !== undefined) payload.duration   = fields.duration
  if (fields.seats    !== undefined) payload.seats      = parseInt(fields.seats) || 0
  if (fields.is_active !== undefined) payload.is_active = fields.is_active

  const { data, error } = await supabaseAdmin.from('courses').update(payload).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ course: data })
}

// DELETE — delete course
export async function DELETE(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await supabaseAdmin.from('courses').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
