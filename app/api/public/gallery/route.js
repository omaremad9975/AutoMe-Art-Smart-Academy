import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Public — no auth required — used by the landing page carousel
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('gallery_photos')
    .select('id, url, caption_ar, caption_en')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ photos: [] })
  return NextResponse.json({ photos: data || [] }, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } })
}
