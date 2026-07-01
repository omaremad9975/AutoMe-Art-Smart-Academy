import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Public endpoint — no auth required.
// Uses service role key so RLS policies don't matter at all.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('id, name_ar, name_en, price, duration, seats, description_ar, description_en, instructor_ar, instructor_en, image_url, icon_key, goals_ar, goals_en, instructor_photo_url, instructor_bio_ar, instructor_bio_en, audience_ar, audience_en, schedule_ar, schedule_en')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[public/courses]', error.message)
    return NextResponse.json({ courses: [] })
  }
  retur