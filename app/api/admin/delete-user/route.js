import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request) {
  try {
    // ── 1. Verify caller ───────────────────────────────────────────────────────
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: caller }, error: tokenError } = await supabaseAdmin.auth.getUser(token)
    if (tokenError || !caller) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: callerAdmin } = await supabaseAdmin
      .from('admins')
      .select('role')
      .eq('email', caller.email)
      .single()

    if (!callerAdmin || callerAdmin.role === 'marketing') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // ── 2. Get target user ─────────────────────────────────────────────────────
    const { adminId, authId } = await request.json()
    if (!adminId) {
      return NextResponse.json({ error: 'adminId is required' }, { status: 400 })
    }

    // ── 3. Remove from admins table ────────────────────────────────────────────
    await supabaseAdmin.from('admins').delete().eq('id', adminId)

    // ── 4. Delete Supabase Auth account if we have auth_id ────────────────────
    if (authId) {
      await supabaseAdmin.auth.admin.deleteUser(authId)
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[delete-user]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
