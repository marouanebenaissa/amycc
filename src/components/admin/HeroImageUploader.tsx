'use client'

import { useState, useRef } from 'react'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface HeroImageUploaderProps {
  initialImageUrl?: string
  defaultImageUrl?: string
}

export function HeroImageUploader({
  initialImageUrl,
  defaultImageUrl = '/images/youth-in-action.jpg',
}: HeroImageUploaderProps) {
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
      setSuccessMessage('تم استيراد الصورة بنجاح! لا تنسَ الضغط على "حفظ كافة الإعدادات" في أسفل الصفحة.')
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

  function handleResetDefault() {
    setImageUrl(defaultImageUrl)
    setError(null)
    setSuccessMessage('تمت استعادة مسار الصورة الرسمية الافتراضية.')
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
      setSuccessMessage('تم حذف صورة الواجهة بنجاح! لا تنسَ الضغط على زر "حفظ كافة الإعدادات" في أسفل الصفحة لتطبيق الحذف على الموقع.')
    } catch {
      setImageUrl('')
      setSuccessMessage('تمت إزالة الصورة من الواجهة. اضغط على زر "حفظ كافة الإعدادات" لاعتماد التغيير.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden input to ensure value is submitted with the main settings form */}
      <input type="hidden" name="heroImageUrl" value={imageUrl} />

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
            صورة الخلفية الرئيسية (Hero Background Image)
          </label>
          <span className="text-3xs text-[#819598]">
            يمكنك استيراد صورة مباشرة من جهازك، استعادة الافتراضي، أو حذف الصورة بالكامل
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* IMPORT BUTTON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || deleting}
            className="px-4 py-2 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 transition-all text-xs inline-flex items-center gap-2 shadow-2xs cursor-pointer disabled:opacity-60"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>جاري الاستيراد...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#f4ce83]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>استيراد صورة (Import)</span>
              </>
            )}
          </button>

          {/* Reset to official default */}
          <button
            type="button"
            onClick={handleResetDefault}
            disabled={uploading || deleting}
            className="px-3 py-2 rounded-xl text-3xs font-bold text-[#5f7174] bg-[#faf7f2] border border-[#e5e0d6] hover:bg-[#f0ebe1] active:scale-98 transition-all cursor-pointer disabled:opacity-60"
          >
            استعادة الافتراضي
          </button>

          {/* DELETE BUTTON */}
          {imageUrl ? (
            <button
              type="button"
              onClick={handleDeleteImage}
              disabled={uploading || deleting}
              className="px-3 py-2 rounded-xl text-3xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:text-red-700 active:scale-98 transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="حذف صورة الواجهة"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>جاري الحذف...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>حذف الصورة</span>
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>

      {/* URL Input Bar (User can see the uploaded URL or paste an external one) */}
      <div className="flex gap-2">
        <input
          type="text"
          dir="ltr"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value)
            setSuccessMessage(null)
            setError(null)
          }}
          placeholder="لا توجد صورة محددة — اكتب رابطاً أو اضغط استيراد"
          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43] font-mono bg-white text-left"
        />
      </div>

      {/* Status Alerts */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-3xs font-bold flex items-center gap-2 animate-in fade-in">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-3xs font-bold flex items-center gap-2 animate-in fade-in">
          <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Live Visual Preview Card (Cinema Morocco88 Simulation) */}
      <div className="relative rounded-2xl overflow-hidden border border-[#e5e0d6] bg-[#08242a] aspect-[21/9] max-h-52 shadow-2xs">
        {imageUrl ? (
          <>
            <ImageWithFallback
              key={imageUrl}
              src={imageUrl}
              fallbackSrc={defaultImageUrl}
              alt="Hero Background Live Preview"
              fill
              className="object-cover object-center opacity-85 transition-opacity duration-300"
            />

            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08242a]/95 via-[#08242a]/40 to-transparent flex items-end p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-3xs text-[#d8f0f4] font-medium bg-[#08242a]/80 px-2.5 py-1 rounded-md border border-white/10 w-fit">
                    معاينة حية للصورة المختارة (Cinematic Preview)
                  </span>
                </div>
                <span dir="ltr" className="text-3xs font-mono text-[#f4ce83] truncate max-w-sm bg-black/50 px-2.5 py-1 rounded-md border border-white/5 text-left">
                  {imageUrl}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[#08242a] via-[#0d3b43] to-[#08242a]">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[#f4ce83]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <span className="text-xs font-bold text-white">لا توجد صورة خلفية (تم حذف الصورة)</span>
            <span className="text-3xs text-[#d8f0f4]/80 mt-1 max-w-sm">
              سيتم عرض الخلفية الهندسية المغربية الداكنة الفاخرة بدلاً من الصورة، أو يمكنك استيراد صورة جديدة
            </span>
          </div>
        )}
      </div>

      {/* Helpful Instructions */}
      <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-3xs space-y-1.5 text-[#5f7174]">
        <div className="font-bold text-[#08242a] flex items-center gap-1.5">
          <span>💡 خيارات إدارة الصورة:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 ps-1">
          <li>
            زر <strong className="text-[#0d3b43]">استيراد صورة (Import)</strong>: لاختيار أي ملف صورة مباشرة من جهازك (JPG, PNG, WebP) ورفعه فورياً.
          </li>
          <li>
            زر <strong className="text-[#5f7174]">استعادة الافتراضي</strong>: للرجوع لصورة شباب المغرب الرسمية.
          </li>
          <li>
            زر <strong className="text-red-600">حذف الصورة</strong>: يتيح لك حذف الصورة الحالية والرجوع إلى الخلفية الداكنة الفاخرة بدون صورة.
          </li>
          <li>
            بعد أي تعديل، اضغط على زر <strong className="text-[#0d3b43]">&ldquo;حفظ كافة الإعدادات&rdquo;</strong> في أسفل الصفحة لاعتماد التغيير نهائياً على الموقع.
          </li>
        </ul>
      </div>
    </div>
  )
}
