'use client'

import { useState, useRef } from 'react'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface AboutHeroImageUploaderProps {
  initialImageUrl?: string
  defaultImageUrl?: string
}

export function AboutHeroImageUploader({
  initialImageUrl,
  defaultImageUrl = '/images/youth-in-action.jpg',
}: AboutHeroImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl ?? defaultImageUrl)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'فشل رفع الصورة. يرجى المحاولة مرة أخرى.')
      }

      setImageUrl(result.url)
      setSuccessMessage('تم استيراد صورة صفحة "من نحن" بنجاح! تذكر الضغط على "حفظ كافة الإعدادات" لتطبيقها.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر استيراد الصورة'
      setError(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleDeleteImage() {
    if (!imageUrl) return

    setDeleting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (imageUrl.startsWith('/uploads/') || imageUrl.includes('supabase.co')) {
        await fetch(`/api/admin/upload?url=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        })
      }

      setImageUrl('')
      setSuccessMessage('تمت إزالة الصورة. اضغط على زر "حفظ كافة الإعدادات" في أسفل الصفحة لتطبيق التغيير.')
    } catch {
      setImageUrl('')
      setSuccessMessage('تمت إزالة الصورة. اضغط على زر "حفظ كافة الإعدادات" لاعتماد التغيير.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden input to ensure value is submitted with the main settings form */}
      <input type="hidden" name="aboutHeroImageUrl" value={imageUrl} />

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Header and Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="block text-2xs font-bold text-[#445457]">
            صورة الواجهة البارزة لصفحة «من نحن»
          </label>
          <span className="text-3xs text-[#819598]">
            صورة عالية الدقة تظهر كبانر سينمائي رئيسي أعلى صفحة «من نحن» (الأبعاد الموصى بها: 1920×800 أو 16:9).
          </span>
        </div>

        <div className="flex items-center gap-2">
          {imageUrl && (
            <button
              type="button"
              onClick={handleDeleteImage}
              disabled={deleting || uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>🗑️</span>
              <span>{deleting ? 'جاري الحذف...' : 'حذف الصورة'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || deleting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span>📁</span>
            <span>{uploading ? 'جاري الرفع...' : 'اختيار صورة من جهازك'}</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3 text-xs rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Live Preview Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#e5e0d6] bg-[#faf7f2] aspect-[21/9] flex items-center justify-center group shadow-2xs">
        {imageUrl ? (
          <>
            <ImageWithFallback
              src={imageUrl}
              alt="معاينة صورة واجهة من نحن"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              fallbackSrc={defaultImageUrl}
            />
            {/* Overlay Gradient with Metadata Preview */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute bottom-3 start-4 end-4 flex items-center justify-between text-white text-3xs font-mono">
              <span className="bg-black/40 backdrop-blur-xs px-2 py-1 rounded-md max-w-[70%] truncate">
                {imageUrl}
              </span>
              <span className="bg-[#0d3b43]/80 px-2 py-1 rounded-md font-sans font-bold">
                معاينة مباشرة
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6 space-y-2">
            <span className="text-3xl block">🖼️</span>
            <p className="text-xs font-bold text-[#08242a]">
              لا توجد صورة مخصصة حالياً لصفحة من نحن
            </p>
            <p className="text-3xs text-[#819598]">
              اضغط على &quot;اختيار صورة من جهازك&quot; أو اكتب رابط الصورة أدناه
            </p>
          </div>
        )}
      </div>

      {/* Fallback Direct URL Input */}
      <div>
        <label className="block text-3xs font-bold text-[#5f7174] mb-1">
          أو أدخل مسار الصورة المباشر (URL أو مسار محلي داخل المشروع):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setError(null)
            }}
            placeholder="/images/youth-in-action.jpg أو رابط خارجي https://..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43] font-mono text-start"
            dir="ltr"
          />
          {defaultImageUrl && imageUrl !== defaultImageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl(defaultImageUrl)}
              className="px-3 py-2 text-3xs font-bold rounded-xl border border-[#e5e0d6] text-[#5f7174] hover:bg-white transition-colors cursor-pointer shrink-0"
              title="استرجاع الصورة الافتراضية"
            >
              استعادة الافتراضية
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
