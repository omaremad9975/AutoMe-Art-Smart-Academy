
import { NextResponse } from 'next/server'
import { supabaseAdmin, verifyCaller } from '@/lib/supabase-admin'

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
