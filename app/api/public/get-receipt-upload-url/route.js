import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit } from '@/lib/rate-limit'

const BUCKET = 'receipts'
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'pdf']

// GET ?ext=jpg
// Public — no auth needed (registration form is public)
// Returns a signed upload URL so the client can upload directly to Supabase Storage
export async function GET(request) {
  // Rate limit: 10 upload URLs per IP per 15 minutes — prevents storage flooding
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
            || request.headers.get('x-real-ip')
            || 'unknown'
  const { allowed } = rateLimit({ key: `upload-url:${ip}`, limit: 10, windowMs: 15 * 60 * 1000 })
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a few minutes.' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const rawExt = (searchParams.get('ext') || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const ext = ALLOWED_EXTS.includes(rawExt) ? rawExt : 'jpg'

  // Bucket is created once in Supabase dashboard — no need to check on every request
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)

  return NextResponse.json({ signedUrl: data.signedUrl, path, publicUrl })
}
