'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FormField, Input, Textarea, Select, SectionDivider } from '@/components/admin/FormControls'
import { createProgram, updateProgram } from '@/lib/actions/content'
import { useAdminLocale } from './AdminLocaleContext'

const PROGRAM_FORM_STRINGS = {
  ar: {
    cancel: 'إلغاء والعودة',
    saving: 'جارٍ الحفظ...',
    update: 'حفظ تعديلات البرنامج',
    create: 'إنشاء البرنامج ونشره',
    uploadBtn: '📁 رفع صورة من الجهاز',
    uploading: '⏳ جارٍ رفع الصورة...',
    deleteImg: 'حذف الصورة',
  },
  fr: {
    cancel: 'Annuler et revenir',
    saving: 'Enregistrement...',
    update: 'Enregistrer les modifications',
    create: 'Créer et publier le programme',
    uploadBtn: '📁 Téléverser une image',
    uploading: '⏳ Téléversement...',
    deleteImg: 'Supprimer l\'image',
  },
  en: {
    cancel: 'Cancel & Return',
    saving: 'Saving...',
    update: 'Save Program Changes',
    create: 'Create & Publish Program',
    uploadBtn: '📁 Upload Image',
    uploading: '⏳ Uploading...',
    deleteImg: 'Remove Image',
  },
}

const CATEGORIES = [
  { value: 'arts', label: '🎨 الفنون التشكيلية والتراث الإبداعي (Arts & Creativity)' },
  { value: 'music', label: '🎵 التراث الموسيقي المغربي (Musical Heritage)' },
  { value: 'theatre', label: '🎭 المسرح وفنون الأداء التعبيري (Theatre & Stage)' },
  { value: 'culture', label: '🏛️ الثقافة وصون التراث الأصيل (Culture & Heritage)' },
  { value: 'youth', label: '🚀 تمكين الشباب والقيادة المجتمعية (Youth Empowerment)' },
  { value: 'volunteer', label: '🤝 العمل التطوعي ومبادرة شباب في العمل (Volunteering)' },
  { value: 'education', label: '📚 التكوين والتطوير الفني (Artistic Education)' },
  { value: 'other', label: '📁 برامج ومبادرات أخرى (Other Initiatives)' },
]

interface ProgramTranslation {
  locale: string
  title: string
  description?: string | null
  objectives?: string | null
  target_audience?: string | null
  activities?: string | null
}

interface ProgramData {
  id: string
  slug: string
  category: string
  city?: string | null
  cover_image?: string | null
  start_date?: string | null
  end_date?: string | null
  program_translations?: ProgramTranslation[]
}

interface ProgramFormProps {
  program?: ProgramData
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter()
  const { locale, dir } = useAdminLocale()
  const tr = PROGRAM_FORM_STRINGS[locale] || PROGRAM_FORM_STRINGS.ar
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [activeLocale, setActiveLocale] = useState<'ar' | 'fr' | 'en'>(locale)
  const [coverImageUrl, setCoverImageUrl] = useState<string>(program?.cover_image || '')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getTranslation = (locale: string) =>
    program?.program_translations?.find((t) => t.locale === locale)

  const arTrans = getTranslation('ar')
  const frTrans = getTranslation('fr')
  const enTrans = getTranslation('en')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP)')
      return
    }

    setUploadingImage(true)
    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      })

      const json = await res.json()
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'فشل رفع الصورة')
      }

      setCoverImageUrl(json.url)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    formData.set('cover_image', coverImageUrl)

    startTransition(async () => {
      try {
        if (program) {
          await updateProgram(program.id, formData)
        } else {
          await createProgram(formData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-[#fde8e7] border border-[#fde8e7] text-[#bd3227] text-xs sm:text-sm font-bold flex items-center gap-2">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Basic fields */}
      <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-[#E5E0D6] pb-3">
          <h2 className="text-base font-black text-[#231f20]">المعلومات العامة للبرنامج (General Details)</h2>
          <p className="text-xs text-[#5C5A55] mt-0.5">
            تحديد التصنيف والمجال الثقافي، النطاق الجغرافي، والرابط الفريد للبرنامج.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="الرابط الفريد (URL Slug) *" hint="أحرف إنجليزية صغيرة وشرطات فقط، مثال: youth-in-action">
            <Input
              name="slug"
              defaultValue={program?.slug}
              placeholder="youth-in-action"
              pattern="[a-z0-9-]+"
              required
            />
          </FormField>

          <FormField label="المجال / التصنيف الثقافي (Category) *" required>
            <Select
              name="category"
              defaultValue={program?.category || 'arts'}
              options={CATEGORIES}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField label="المدينة أو النطاق الجغرافي" hint="اتركه فارغاً للنطاق الوطني العام">
            <Input name="city" defaultValue={program?.city || ''} placeholder="مراكش / المملكة المغربية" />
          </FormField>

          <FormField label="تاريخ البداية (Start Date)">
            <Input
              name="start_date"
              type="date"
              defaultValue={program?.start_date?.slice(0, 10) || ''}
            />
          </FormField>

          <FormField label="تاريخ الاختتام (End Date)">
            <Input
              name="end_date"
              type="date"
              defaultValue={program?.end_date?.slice(0, 10) || ''}
            />
          </FormField>
        </div>

        {/* Cover Image Uploader */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#231f20]">
            الصورة البارزة للبرنامج (Program Cover Image)
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            {coverImageUrl ? (
              <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-[#e5e0d6] shrink-0 bg-white shadow-2xs">
                <Image
                  src={coverImageUrl}
                  alt="Cover Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-36 h-24 rounded-xl border border-dashed border-[#cfc7b9] flex flex-col items-center justify-center text-[#5C5A55] shrink-0 bg-white">
                <span className="text-2xl">🖼️</span>
                <span className="text-3xs mt-1">لا توجد صورة</span>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-4 py-2 rounded-xl bg-[#231f20] text-white text-xs font-bold hover:bg-[#d2a82b] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {uploadingImage ? tr.uploading : tr.uploadBtn}
                </button>

                {coverImageUrl && (
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl('')}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    {tr.deleteImg}
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="cover_image"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="رابط أو مسار الصورة: /uploads/... أو https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-[#231f20] focus:outline-none focus:border-[#231f20]"
                />
              </div>
              <p className="text-3xs text-[#5C5A55]">
                الأبعاد الموصى بها: 1200×800 بكسل بحجم أقل من 4 ميغابايت بصيغة JPG أو WebP.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trilingual Translations */}
      <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D6] pb-4">
          <div>
            <h2 className="text-base font-black text-[#231f20]">تفاصيل ومحتوى البرنامج باللغات الثلاث</h2>
            <p className="text-xs text-[#5C5A55] mt-0.5">
              إدخال العنوان، الوصف الشامل، الأهداف، الفئة المستهدفة، والأنشطة المبرمجة.
            </p>
          </div>

          <div className="flex gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] self-start sm:self-auto">
            {(['ar', 'fr', 'en'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveLocale(loc)}
                className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  activeLocale === loc
                    ? 'bg-[#231f20] text-white shadow-xs'
                    : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
                }`}
              >
                {loc === 'ar' ? 'العربية 🇲🇦' : loc === 'fr' ? 'Français 🇫🇷' : 'English 🇬🇧'}
              </button>
            ))}
          </div>
        </div>

        {/* Arabic Fields */}
        <div className={activeLocale === 'ar' ? 'space-y-5' : 'hidden'}>
          <SectionDivider title="المحتوى باللغة العربية (RTL)" />
          <FormField label="عنوان البرنامج بالعربية *" required>
            <Input
              name="title_ar"
              dir="rtl"
              defaultValue={arTrans?.title || ''}
              placeholder="مثال: مبادرة شباب في العمل (Youth in Action)"
              required
            />
          </FormField>

          <FormField label="الوصف الشامل للبرنامج (Arabic Description)">
            <Textarea
              name="description_ar"
              dir="rtl"
              rows={4}
              defaultValue={arTrans?.description || ''}
              placeholder="البرنامج الرائد الهادف إلى إدماج الشباب وصقل المهارات..."
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="الأهداف الرئيسية (Key Objectives)">
              <Textarea
                name="objectives_ar"
                dir="rtl"
                rows={3}
                defaultValue={arTrans?.objectives || ''}
                placeholder="تأهيل 200 شاب سنوياً، تنمية المهارات الحياتية، وتعزيز المشاركة المدنية..."
              />
            </FormField>

            <FormField label="الفئة المستهدفة (Target Audience)">
              <Textarea
                name="target_audience_ar"
                dir="rtl"
                rows={3}
                defaultValue={arTrans?.target_audience || ''}
                placeholder="الشباب والطلبة من 16 إلى 30 سنة، الهواة والمبدعون الصاعدون..."
              />
            </FormField>
          </div>

          <FormField label="الأنشطة والورشات المبرمجة (Key Activities)">
            <Textarea
              name="activities_ar"
              dir="rtl"
              rows={3}
              defaultValue={arTrans?.activities || ''}
              placeholder="محترفات الفنون التشكيلية، ورشات الحكاية والتعبير، معارض إبداعية..."
            />
          </FormField>
        </div>

        {/* French Fields */}
        <div className={activeLocale === 'fr' ? 'space-y-5' : 'hidden'}>
          <SectionDivider title="Contenu en Français (LTR)" />
          <FormField label="Titre du programme (Français) *" required>
            <Input
              name="title_fr"
              defaultValue={frTrans?.title || ''}
              placeholder="ex. Initiative Jeunesse en Action"
              required
            />
          </FormField>

          <FormField label="Description complète (Français)">
            <Textarea
              name="description_fr"
              rows={4}
              defaultValue={frTrans?.description || ''}
              placeholder="Programme phare de l'AMYCC pour l'engagement des jeunes..."
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Objectifs clés (Français)">
              <Textarea
                name="objectives_fr"
                rows={3}
                defaultValue={frTrans?.objectives || ''}
                placeholder="Développer les compétences de vie, leadership culturel..."
              />
            </FormField>

            <FormField label="Public cible (Français)">
              <Textarea
                name="target_audience_fr"
                rows={3}
                defaultValue={frTrans?.target_audience || ''}
                placeholder="Jeunes de 16 à 30 ans, artistes émergents..."
              />
            </FormField>
          </div>

          <FormField label="Activités programmées (Français)">
            <Textarea
              name="activities_fr"
              rows={3}
              defaultValue={frTrans?.activities || ''}
              placeholder="Ateliers artistiques, résidences de création, expositions collectives..."
            />
          </FormField>
        </div>

        {/* English Fields */}
        <div className={activeLocale === 'en' ? 'space-y-5' : 'hidden'}>
          <SectionDivider title="Content in English (LTR)" />
          <FormField label="Program Title (English) *" required>
            <Input
              name="title_en"
              defaultValue={enTrans?.title || ''}
              placeholder="e.g. Youth in Action Initiative"
              required
            />
          </FormField>

          <FormField label="Full Description (English)">
            <Textarea
              name="description_en"
              rows={4}
              defaultValue={enTrans?.description || ''}
              placeholder="Flagship volunteering program empowering youth to co-create..."
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Key Objectives (English)">
              <Textarea
                name="objectives_en"
                rows={3}
                defaultValue={enTrans?.objectives || ''}
                placeholder="Empower 200 youth annually, foster creative leadership..."
              />
            </FormField>

            <FormField label="Target Audience (English)">
              <Textarea
                name="target_audience_en"
                rows={3}
                defaultValue={enTrans?.target_audience || ''}
                placeholder="Youth & students aged 16–30, emerging talents..."
              />
            </FormField>
          </div>

          <FormField label="Key Activities (English)">
            <Textarea
              name="activities_en"
              rows={3}
              defaultValue={enTrans?.activities || ''}
              placeholder="Creative masterclasses, heritage preservation camps, community exhibitions..."
            />
          </FormField>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle" dir={dir}>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-xs font-bold text-[#5C5A55] border border-[#cfc7b9] rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer"
        >
          {tr.cancel}
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-8 py-3 text-xs sm:text-sm font-black text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <span>{isPending ? '⏳' : '💾'}</span>
          <span>{isPending ? tr.saving : program ? tr.update : tr.create}</span>
        </button>
      </div>
    </form>
  )
}
