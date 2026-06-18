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

// Ensure a public bucket exists
async function ensureBucket(bucket) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = (buckets || []).some((b) => b.name === bucket)
  if (!exists) {
    await supabaseAdmin.storage.createBucket(bucket, { public: true })
  }
}

export async function POST(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file     = formData.get('file')
  const bucket   = formData.get('bucket') || 'gallery'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File must be JPG, PNG, WEBP, or PDF' }, { status: 400 })
  }

  // Max 10 MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 10 MB' }, { status: 400 })
  }

  await ensureBucket(bucket)

  const ext      = file.name.split('.').pop().toLowerCase()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer   = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

  return NextResponse.json({ url: publicUrl, path: fileName, bucket })
}

// DELETE — remove a file from storage
export async function DELETE(request) {
  const admin = await verifyCaller(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bucket, path } = await request.json()
  if (!bucket || !path) return NextResponse.json({ error: 'Missing bucket or path' }, { status: 400 })

  const { error } = await supabaseAdmin.storage.from(bucket).remove([path])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
