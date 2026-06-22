import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function verifyToken(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
    if (!payload.email || !payload.exp || Date.now() > payload.exp) return null
    return payload.email
  } catch {
    return null
  }
}

// GET — returns all certificates for the logged-in student
export async function GET(request) {
  const email = verifyToken(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('student_certificates')
    .select('*')
    .eq('student_email', email)
    .order('issued_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ certificates: data || [], email })
}
