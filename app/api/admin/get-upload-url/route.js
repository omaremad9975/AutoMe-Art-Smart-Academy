
import { NextResponse } from 'next/server'
import { supabaseAdmin, verifyCaller } from '@/lib/supabase-admin'

async function ensureBucket(bucket) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = (buckets || []).some((b) => b.name === bucket)
  if (!exists) {
    await supabaseAdmin.storage.createBucket(bucket, { public: true })
  }
}

// GET ?bucket=gallery&ext=jpg
// Returns a signed upload URL so the client can upload DIRECTLY to Supabase Storage
// without routing the file through the Vercel serverless function (avoids 4.5MB limit)
export async function GET(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const bucket = searchParams.get('bucket') || 'gallery'
  const ext    = (searchParams.get('ext') || 'jpg').replace(/[^a-zA-Z0-9]/g, '')

  await ensureBucket(bucket)

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(path)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)

  return NextResponse.json({ signedUrl: data.signedUrl, path, publicUrl })
}
