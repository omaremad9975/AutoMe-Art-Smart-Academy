
import { NextResponse } from 'next/server'
import { supabaseAdmin, verifyCaller } from '@/lib/supabase-admin'

// Uses service role key — bypasses RLS on the admins table entirely.
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
