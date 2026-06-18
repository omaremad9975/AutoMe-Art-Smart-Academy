import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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
  const { data: admin } = await supabaseAdmin
    .from('admins').select('role').eq('email', user.email).single()
  if (!admin || admin.role === 'marketing') return null
  return admin
}

// GET — list all gallery photos
export async function GET(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('gallery_photos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photos: data || [] })
}

// POST — add a new gallery photo
export async function POST(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url, caption_ar, caption_en, sort_order } = await request.json()
  if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('gallery_photos')
    .insert({ url, caption_ar: caption_ar || '', caption_en: caption_en || '', sort_order: sort_order || 0 })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photo: data })
}

// PATCH — update captions or sort_order
export async function PATCH(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, caption_ar, caption_en, sort_order } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

  const updates = {}
  if (caption_ar !== undefined) updates.caption_ar = caption_ar
  if (caption_en !== undefined) updates.caption_en = caption_en
  if (sort_order !== undefined) updates.sort_order = sort_order

  const { error } = await supabaseAdmin
    .from('gallery_photos')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE — remove a gallery photo record (storage file deleted separately)
export async function DELETE(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('gallery_photos')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
