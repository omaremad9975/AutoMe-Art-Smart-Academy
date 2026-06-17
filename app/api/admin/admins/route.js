import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Uses service role key — bypasses RLS on the admins table entirely.
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
  // Service role bypasses RLS — this lookup always works regardless of policies
  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('role')
    .eq('email', user.email)
    .single()
  if (!admin || admin.role === 'marketing') return null
  return admin
}

// GET — list all admins
export async function GET(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('admins')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ admins: data || [] })
}
