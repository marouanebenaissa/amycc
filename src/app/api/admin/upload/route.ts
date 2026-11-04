import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Supported Supabase storage buckets in priority order
const CANDIDATE_BUCKETS = ['upload', 'media', 'images', 'public']

export async function POST(request: Request) {
  try {
    // 1. Authenticate the admin user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بتنفيذ هذه العملية (Unauthorized)' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'لم يتم استلام أي ملف (No file uploaded)' },
        { status: 400 }
      )
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/svg+xml',
    ]

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'صيغة الملف غير مدعومة. يرجى اختيار صورة بصيغة JPG أو PNG أو WebP أو AVIF',
        },
        { status: 400 }
      )
    }

    // Limit to 15MB
    const maxSizeBytes = 15 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          error: 'حجم الصورة يتجاوز الحد الأقصى المسموح به (15 ميغابايت)',
        },
        { status: 400 }
      )
    }

    const rawExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const ext = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'].includes(rawExt)
      ? rawExt
      : 'jpg'
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const filename = `hero-${Date.now()}-${randomSuffix}.${ext}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 2. Primary Production Cloud Storage via Supabase Service Role
    // (Bypasses Storage RLS & works reliably on Vercel serverless)
    let lastStorageError: string | null = null

    // Early check: if service role key is missing, fail fast with clear message
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            'الإعداد مفقود: SUPABASE_SERVICE_ROLE_KEY غير موجود. يرجى إضافته في Vercel → Settings → Environment Variables ثم إعادة النشر.',
        },
        { status: 500 }
      )
    }

    try {
      const adminClient = createAdminClient()

      // List existing buckets to find the right one
      let targetBucket: string | null = null
      const { data: buckets } = await adminClient.storage.listBuckets()
      const existingBucketNames = (buckets || []).map((b) => b.name)

      for (const candidate of CANDIDATE_BUCKETS) {
        if (existingBucketNames.includes(candidate)) {
          targetBucket = candidate
          break
        }
      }

      // If no candidate bucket exists, attempt to create 'upload'
      if (!targetBucket) {
        const { error: createErr } = await adminClient.storage.createBucket('upload', {
          public: true,
          fileSizeLimit: maxSizeBytes,
        })
        if (!createErr) {
          targetBucket = 'upload'
        } else {
          // If creation fails, default to first existing bucket or 'upload'
          targetBucket = existingBucketNames[0] || 'upload'
        }
      }

      // Upload file to the target bucket under hero/ directory
      const storageFilePath = `hero/${filename}`
      const { data: uploadData, error: uploadErr } = await adminClient.storage
        .from(targetBucket)
        .upload(storageFilePath, buffer, {
          contentType: file.type,
          upsert: true,
        })

      if (!uploadErr && uploadData) {
        const { data: urlData } = adminClient.storage
          .from(targetBucket)
          .getPublicUrl(storageFilePath)

        if (urlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            filename,
            source: 'supabase_storage',
            bucket: targetBucket,
          })
        }
      }

      if (uploadErr) {
        lastStorageError = uploadErr.message
      }
    } catch (err: unknown) {
      lastStorageError = err instanceof Error ? err.message : 'Supabase storage error'
    }

    // 3. Fallback for Local Development ONLY
    // Try writing to /tmp (always writable, even on Vercel) or public/uploads (local dev)
    // Never try public/uploads on serverless environments - it's read-only
    const isServerless = Boolean(
      process.env.VERCEL ||
        process.env.AWS_LAMBDA_FUNCTION_NAME ||
        process.env.NETLIFY ||
        process.env.RAILWAY_ENVIRONMENT
    )

    if (!isServerless) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await fs.promises.mkdir(uploadsDir, { recursive: true })
        const targetFilePath = path.join(uploadsDir, filename)
        await fs.promises.writeFile(targetFilePath, buffer)

        const publicUrl = `/uploads/${filename}`

        return NextResponse.json({
          success: true,
          url: publicUrl,
          filename,
          source: 'local_public',
        })
      } catch (localFsErr: unknown) {
        const localMsg = localFsErr instanceof Error ? localFsErr.message : ''
        lastStorageError = `${lastStorageError || ''} (Local FS: ${localMsg})`
      }
    }

    // Final error — provide a clear diagnostic message
    const missingKey = !process.env.SUPABASE_SERVICE_ROLE_KEY
    const errorMsg = missingKey
      ? 'مفتاح SUPABASE_SERVICE_ROLE_KEY غير مضاف في إعدادات Vercel. يرجى إضافته في لوحة تحكم Vercel → Settings → Environment Variables.'
      : lastStorageError ||
        'تعذر حفظ الصورة في سحابة التخزين. يرجى التحقق من إعدادات سلة التخزين (Supabase Storage Bucket).'

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    )
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء رفع الصورة'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بحذف هذا الملف' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const urlToDelete = searchParams.get('url')

    if (!urlToDelete) {
      return NextResponse.json(
        { success: false, error: 'لم يتم تحديد رابط الملف' },
        { status: 400 }
      )
    }

    // 1. If file is on Supabase Storage
    if (urlToDelete.includes('supabase.co')) {
      try {
        const adminClient = createAdminClient()
        // URL pattern: .../storage/v1/object/public/[bucket]/[...path]
        const match = urlToDelete.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
        if (match) {
          const bucket = match[1]
          const objectPath = decodeURIComponent(match[2])
          await adminClient.storage.from(bucket).remove([objectPath])
        }
      } catch {
        // Ignore Supabase storage errors on delete
      }
    }

    // 2. If file is stored locally in /uploads/ (local development only)
    if (urlToDelete.startsWith('/uploads/')) {
      try {
        const filename = path.basename(urlToDelete)
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath)
        }
      } catch {
        // Ignore filesystem delete errors
      }
    }

    return NextResponse.json({ success: true, message: 'تم حذف الملف بنجاح' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء حذف الملف'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
