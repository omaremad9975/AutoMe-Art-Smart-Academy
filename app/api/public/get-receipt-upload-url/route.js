import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Service-role client for storage operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const BUCKET = 'receipts'
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'pdf']

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = (buckets || []).some((b) => b.name === BUCKET)
  if (!exists) {
    // Public bucket — URL is unguessable (random path), and admin needs to view receipts easily
    await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
  }
}

// GET ?ext=jpg
// Public — no auth needed (registration form is public)
// Returns a signed upload URL so the client can upload directly to Supabase Storage
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const rawExt = (searchParams.get('ext') || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const ext = ALLOWED_EXTS.includes(rawExt) ? rawExt : 'jpg'

  await ensureBucket()

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)

  return NextResponse.json({ signedUrl: data.signedUrl, path, publicUrl })
}
