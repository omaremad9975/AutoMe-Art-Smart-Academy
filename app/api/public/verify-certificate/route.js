import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET ?code=ABC123
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('student_certificates')
    .select('*')
    .eq('verification_code', code.toUpperCase())
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data)  return NextResponse.json({ valid: false }, { status: 404 })

  return NextResponse.json({ valid: true, certificate: data })
}
