
import { NextResponse } from 'next/server'
import { supabaseAdmin, verifyCaller } from '@/lib/supabase-admin'

// Service role client — bypasses RLS entirely
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
