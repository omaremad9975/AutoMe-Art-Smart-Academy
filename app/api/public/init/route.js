// Single endpoint that returns courses + settings in one round trip.
// Replaces two separate fetches the landing page used to make on mount.
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const [coursesResult, settingsResult] = await Promise.all([
    supabaseAdmin
      .from('courses')
      .select('id, name_ar, name_en, price, duration, seats, description_ar, description_en, instructor_ar, instructor_en, image_url, icon_key')
      .eq('is_active', true)
      .order('created_at', { ascending: true }),

    supabaseAdmin
      .from('settings')
      .select('key, value'),
  ])

  const courses = coursesResult.data || []

  const settings = {}
  ;(settingsResult.data || []).forEach((r) => { settings[r.key] = r.value })

  return NextResponse.json(
    { courses, settings },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
