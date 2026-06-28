// Shared Supabase service-role client — singleton, created once per process.
// Import this instead of calling createClient() in every API route.
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Shared verifyCaller — used by all admin API routes.
// Returns the admin record { role } or null if unauthorized.
export async function verifyCaller(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return null

  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('role')
    .eq('email', user.email)
    .single()

  if (!admin) return null
  return admin
}
