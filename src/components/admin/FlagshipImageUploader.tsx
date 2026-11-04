'use client'

import { useState, useRef } from 'react'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface FlagshipImageUploaderProps {
  initialImageUrl?: string
  defaultImageUrl?: string
  imageCaption?: string
}

export function FlagshipImageUploader({
  initialImageUrl,
  defaultImageUrl = '/images/youth-in-action.jpg',
  imageCaption = 'طاقات شبابية تقود المشهد الثقافي',
}: FlagshipImageUploaderProps) {
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
      setSuccessMessage('تم استيراد صورة البرنامج الرائد بنجاح!')
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
      setSuccessMessage('تم حذف صورة البرنامج الرائد.')
    } catch {
      setImageUrl('')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="flagshipImageUrl" value={imageUrl} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="block text-2xs font-bold text-[#5C5A55]">
            صورة بطاقة البرنامج الرائد (Spotlight Card Image)
          </label>
          <span className="text-3xs text-[#5C5A55]">
            الصورة المعروضة في البطاقة الجانبية للبرنامج الرائد
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || deleting}
            className="px-4 py-2 rounded-xl font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 transition-all text-xs inline-flex items-center gap-2 shadow-2xs cursor-pointer disabled:opacity-60"
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
                <svg className="w-4 h-4 text-[#ffd22f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>استيراد صورة (Import)</span>
              </>
            )}
          </button>

          {imageUrl ? (
            <button
              type="button"
              onClick={handleDeleteImage}
              disabled={uploading || deleting}
              className="px-3.5 py-2 rounded-xl text-3xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:text-red-700 active:scale-98 transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {deleting ? 'جاري الحذف...' : 'حذف الصورة'}
            </button>
          ) : null}
        </div>
      </div>

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
          placeholder="/images/youth-in-action.jpg"
          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] font-mono bg-white text-left"
        />
      </div>

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-3xs font-bold flex items-center gap-2">
          <span>✓ {successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-3xs font-bold flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Visual Preview Card — Poster Showcase format */}
      <div className="max-w-xs sm:max-w-sm mx-auto rounded-3xl p-3 bg-gradient-to-b from-[#d2a82b]/30 to-[#231f20] border border-[#d2a82b]/30 shadow-2xl overflow-hidden">
        <div className="relative aspect-[3/4] min-h-[440px] rounded-2xl overflow-hidden bg-[#231f20]">
          {imageUrl ? (
            <>
              <ImageWithFallback
                key={imageUrl}
                src={imageUrl}
                fallbackSrc={defaultImageUrl}
                alt="Flagship Poster Preview"
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#231f20] via-[#231f20]/30 to-black/20 opacity-85" />
              <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-4xs font-bold text-[#ffd22f] uppercase tracking-wider">
                معاينة ملصق Poster
              </div>
              <div className="absolute bottom-4 start-4 end-4 text-white">
                <span className="text-3xs text-[#ffd22f] font-bold uppercase tracking-wider block">
                  AMYCC Morocco
                </span>
                <span className="text-sm sm:text-base font-black block mt-1 leading-snug drop-shadow-md">
                  {imageCaption}
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-[#E2DED6]">
              <span className="text-xs font-bold">لا توجد صورة محددة</span>
              <span className="text-3xs text-[#5C5A55] mt-1">انقر على &ldquo;استيراد صورة&rdquo; لرفع ملصق البرنامج</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
