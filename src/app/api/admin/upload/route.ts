import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بتنفيذ هذه العملية (Unauthorized)' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'لم يتم استلام أي ملف (No file uploaded)' }, { status: 400 })
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
    ]

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'صيغة الملف غير مدعومة. يرجى اختيار صورة بصيغة JPG أو PNG أو WebP أو AVIF',
      }, { status: 400 })
    }

    // Limit to 15MB
    const maxSizeBytes = 15 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return NextResponse.json({
        success: false,
        error: 'حجم الصورة يتجاوز الحد الأقصى المسموح به (15 ميغابايت)',
      }, { status: 400 })
    }

    const rawExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const ext = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'].includes(rawExt) ? rawExt : 'jpg'
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const filename = `hero-${Date.now()}-${randomSuffix}.${ext}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 1. Try Supabase Storage if bucket exists
    try {
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('media')
        .upload(`hero/${filename}`, buffer, {
          contentType: file.type,
          upsert: true,
        })

      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(`hero/${filename}`)
        if (urlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            filename,
            source: 'supabase_storage',
          })
        }
      }
    } catch {
      // Supabase storage unavailable or unconfigured, fall back to local filesystem
    }

    // 2. Local filesystem storage in public/uploads/
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء رفع الصورة'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بحذف هذا الملف' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const urlToDelete = searchParams.get('url')

    if (!urlToDelete) {
      return NextResponse.json({ success: false, error: 'لم يتم تحديد رابط الملف' }, { status: 400 })
    }

    // If file is stored locally in /uploads/
    if (urlToDelete.startsWith('/uploads/')) {
      const filename = path.basename(urlToDelete)
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath)
      }
    }

    // Also attempt deletion from Supabase Storage if applicable
    if (urlToDelete.includes('supabase.co')) {
      try {
        const parts = urlToDelete.split('/')
        const filename = parts[parts.length - 1]
        await supabase.storage.from('media').remove([`hero/${filename}`])
      } catch {
        // Ignore Supabase storage errors
      }
    }

    return NextResponse.json({ success: true, message: 'تم حذف الملف بنجاح' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء حذف الملف'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

