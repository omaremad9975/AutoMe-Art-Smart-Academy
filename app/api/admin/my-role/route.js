import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Service role client — bypasses RLS entirely
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET — returns the role of the currently authenticated user
export async function GET(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminRow } = await supabaseAdmin
    .from('admins')
    .select('role')
    .eq('email', user.email)
    .single()

  return NextResponse.json({ role: adminRow?.role || null })
}
