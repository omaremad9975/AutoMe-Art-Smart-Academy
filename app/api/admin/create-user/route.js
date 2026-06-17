import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Admin Supabase client — uses service role key, runs server-side only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request) {
  try {
    // ── 1. Verify caller is authenticated ──────────────────────────────────────
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    // Verify the token is valid
    const { data: { user: caller }, error: tokenError } = await supabaseAdmin.auth.getUser(token)
    if (tokenError || !caller) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── 2. Check the caller is an admin or super_admin ─────────────────────────
    const { data: callerAdmin } = await supabaseAdmin
      .from('admins')
      .select('role')
      .eq('email', caller.email)
      .single()

    if (!callerAdmin || callerAdmin.role === 'marketing') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // ── 3. Parse request body ──────────────────────────────────────────────────
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 })
    }

    const validRoles = ['admin', 'super_admin', 'marketing']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // ── 4. Create Supabase Auth user ───────────────────────────────────────────
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip email confirmation — user can login immediately
    })

    if (authError) {
      // Handle common errors with a friendly message
      if (authError.message.includes('already been registered')) {
        return NextResponse.json({ error: 'This email already has an account' }, { status: 400 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // ── 5. Insert into admins table ────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from('admins')
      .insert([{ email, role, auth_id: authData.user.id }])

    if (dbError) {
      // Cleanup: delete the auth user we just created to keep things consistent
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)

      if (dbError.message.includes('duplicate') || dbError.code === '23505') {
        return NextResponse.json({ error: 'This email is already in the admins list' }, { status: 400 })
      }
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, userId: authData.user.id })

  } catch (err) {
    console.error('[create-user]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
