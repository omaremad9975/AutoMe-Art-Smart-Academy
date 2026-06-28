import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('key, value')

  if (error) return NextResponse.json({ settings: {} })

  const map = {}
  ;(data || []).forEach((r) => { map[r.key] = r.value })
  return NextResponse.json({ settings: map }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } })
}
