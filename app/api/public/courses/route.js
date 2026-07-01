import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Public endpoint — no auth required.
// Uses service role key so RLS policies don't matter at all.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const FULL_SELECT = 'id, name_ar, name_en, price, duration, seats, description_ar, description_en, instructor_ar, instructor_en, image_url, icon_key, goals_ar, goals_en, instructor_photo_url, instructor_bio_ar, instructor_bio_en, audience_ar, audience_en, schedule_ar, schedule_en, requirements_ar, requirements_en, language_ar, language_en'
const CORE_SELECT = 'id, name_ar, name_en, price, duration, seats, description_ar, description_en, instructor_ar, instructor_en, image_url, icon_key, goals_ar, goals_en, instructor_photo_url, instructor_bio_ar, instructor_bio_en, audience_ar, audience_en, schedule_ar, schedule_en'

export async function GET() {
  let { data, error } = await supabaseAdmin
    .from('courses')
    .select(FULL_SELECT)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    // Most likely cause: requirements_ar/en or language_ar/en columns don't exist yet
    // (the SQL migration wasn't run). Fall back to the core column set so the site
    // keeps working instead of every course page bouncing visitors back to home.
    console.error('[public/courses] full select failed, retrying without requirements/language columns:', error.message)
    const fallback = await supabaseAdmin
      .from('courses')
      .select(CORE_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    console.error('[public/courses] fallback select also failed:', error.message)
    return NextResponse.json({ courses: [] })
  }
  return NextResponse.json({ courses: data || [] }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } })
}
