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
  const { data: admin } = await supabaseAdmin
    .from('admins').select('role').eq('email', user.email).single()
  if (!admin || admin.role === 'marketing') return null
  return admin
}

// GET — fetch all settings
export async function GET(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('settings').select('key, value')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const map = {}
  ;(data || []).forEach((r) => { map[r.key] = r.value })
  return NextResponse.json({ settings: map })
}

// POST — upsert all settings
export async function POST(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const rows = Object.entries(body).map(([key, value]) => ({ key, value: String(value) }))

  if (rows.length === 0) return NextResponse.json({ error: 'No settings provided' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
