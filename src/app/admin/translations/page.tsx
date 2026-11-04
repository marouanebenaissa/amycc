import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface TranslationRow {
  locale: string
  title: string
}

interface ContentItem {
  id: string
  type: 'program' | 'event' | 'news'
  slug: string
  titleAr?: string
  hasAr: boolean
  hasFr: boolean
  hasEn: boolean
  editUrl: string
}

export default async function AdminTranslationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch all programs, events, and news articles with their translations
  const [
    { data: rawPrograms },
    { data: rawEvents },
    { data: rawNews },
  ] = await Promise.all([
    supabase.from('programs').select('id, slug, program_translations(locale, title)'),
    supabase.from('events').select('id, slug, event_translations(locale, title)'),
    supabase.from('news_articles').select('id, slug, news_translations(locale, title)'),
  ])

  const contentItems: ContentItem[] = []

  // Process Programs
  if (rawPrograms) {
    rawPrograms.forEach((p) => {
      const trans = (p.program_translations as TranslationRow[]) || []
      const locales = trans.map((t) => t.locale)
      const arTrans = trans.find((t) => t.locale === 'ar')
      contentItems.push({
        id: p.id,
        type: 'program',
        slug: p.slug,
        titleAr: arTrans?.title || p.slug,
        hasAr: locales.includes('ar'),
        hasFr: locales.includes('fr'),
        hasEn: locales.includes('en'),
        editUrl: `/admin/programs/${p.id}/edit`,
      })
    })
  }

  // Process Events
  if (rawEvents) {
    rawEvents.forEach((e) => {
      const trans = (e.event_translations as TranslationRow[]) || []
      const locales = trans.map((t) => t.locale)
      const arTrans = trans.find((t) => t.locale === 'ar')
      contentItems.push({
        id: e.id,
        type: 'event',
        slug: e.slug,
        titleAr: arTrans?.title || e.slug,
        hasAr: locales.includes('ar'),
        hasFr: locales.includes('fr'),
        hasEn: locales.includes('en'),
        editUrl: `/admin/events/${e.id}/edit`,
      })
    })
  }

  // Process News Articles
  if (rawNews) {
    rawNews.forEach((n) => {
      const trans = (n.news_translations as TranslationRow[]) || []
      const locales = trans.map((t) => t.locale)
      const arTrans = trans.find((t) => t.locale === 'ar')
      contentItems.push({
        id: n.id,
        type: 'news',
        slug: n.slug,
        titleAr: arTrans?.title || n.slug,
        hasAr: locales.includes('ar'),
        hasFr: locales.includes('fr'),
        hasEn: locales.includes('en'),
        editUrl: `/admin/news/${n.id}/edit`,
      })
    })
  }

  // Calculate completeness
  const totalItems = contentItems.length
  const missingItems = contentItems.filter((i) => !i.hasAr || !i.hasFr || !i.hasEn)
  const fullyTranslatedCount = totalItems - missingItems.length
  const coveragePercent = totalItems > 0 ? Math.round((fullyTranslatedCount / totalItems) * 100) : 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-2xs font-bold text-[#bd3227] uppercase tracking-wider mb-1">
            <span>إدارة اللغات والترجمة</span>
            <span>•</span>
            <span>Translation Management & Completeness</span>
          </div>
          <h1 className="text-2xl font-black text-[#231f20]">
            متابعة اكتمال الترجمة وتفادي النقص
          </h1>
          <p className="text-xs text-[#5C5A55] mt-1 max-w-2xl">
            مراقبة تغطية المحتوى باللغات الثلاث (العربية الرسمية، الفرنسية، الإنجليزية)، وتنبيه الإدارة الفوري عند وجود أي محتوى غير مترجم لتفادي نشره منقوصاً.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white border border-[#e5e0d6] text-center shadow-2xs">
            <span className="text-3xs text-[#5C5A55] block font-bold">نسبة الاكتمال التام</span>
            <span className="text-xl font-black text-[#231f20]">{coveragePercent}%</span>
          </div>
        </div>
      </div>

      {/* Warning Banner if any missing translations */}
      {missingItems.length > 0 ? (
        <div className="p-5 rounded-2xl bg-[#fde8e7] border border-[#fde8e7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">⚠️</span>
            <div>
              <h2 className="text-sm font-bold text-[#bd3227]">
                تنبيه: يوجد {missingItems.length} عنصر يحتاج إلى استكمال الترجمة!
              </h2>
              <p className="text-2xs text-[#8f1f16] mt-0.5 leading-relaxed">
                وفقاً لمعايير الجودة المحددة للمنصة، يجب أن تتوفر جميع البرامج والفعاليات والأخبار باللغات الثلاث قبل اعتماد نشرها العام.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">✅</span>
          <div>
            <h2 className="text-sm font-bold text-emerald-800">
              جميع عناصر المحتوى مكتملة الترجمة بنسبة 100%!
            </h2>
            <p className="text-2xs text-emerald-700 mt-0.5">
              كل البرامج والفعاليات والأخبار الحالية تتوفر بنسخ عربية وفرنسية وإنجليزية متزامنة.
            </p>
          </div>
        </div>
      )}

      {/* System Dictionaries Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#231f20]">قاموس العربية (AR)</span>
            <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              اللغة الافتراضية RTL
            </span>
          </div>
          <p className="text-3xs text-[#5C5A55] leading-relaxed">
            ملف الرسائل الأساسي المعتمد لهوية الجمعية في المغرب، مفاتيح الترجمة: 86 مفتاحاً.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#231f20]">قاموس الفرنسية (FR)</span>
            <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              LTR متطابق
            </span>
          </div>
          <p className="text-3xs text-[#5C5A55] leading-relaxed">
            النسخة المعتمدة للشراكات الإقليمية والمؤسسية في المغرب والدول الفرنكوفونية.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#231f20]">قاموس الإنجليزية (EN)</span>
            <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              LTR متطابق
            </span>
          </div>
          <p className="text-3xs text-[#5C5A55] leading-relaxed">
            النسخة الدولية الموجهة للشركاء العالميين والمؤسسات الدولية والمنظمات غير الحكومية.
          </p>
        </div>
      </div>

      {/* Content Translations Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="p-4 bg-[#FAF8F5] border-b border-[#e5e0d6] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#231f20] uppercase tracking-wider">
            مصفوفة حالة الترجمة لعناصر المحتوى (Content Translation Matrix)
          </h2>
          <span className="text-2xs text-[#5C5A55]">
            إجمالي العناصر: {contentItems.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#FAF8F5]/50 border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">نوع المحتوى / Content Type</th>
                <th className="px-6 py-4 text-start">العنوان / المعرف (Slug)</th>
                <th className="px-6 py-4 text-center">العربية (AR)</th>
                <th className="px-6 py-4 text-center">الفرنسية (FR)</th>
                <th className="px-6 py-4 text-center">الإنجليزية (EN)</th>
                <th className="px-6 py-4 text-start">الإجراء / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {contentItems.length > 0 ? (
                contentItems.map((item) => {
                  const typeLabel =
                    item.type === 'program'
                      ? 'برنامج / Program'
                      : item.type === 'event'
                      ? 'فعالية / Event'
                      : 'خبر / News'

                  return (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-lg text-3xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20]">
                          {typeLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#231f20]">{item.titleAr}</div>
                        <div className="text-3xs text-[#5C5A55] font-mono">{item.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.hasAr ? (
                          <span className="px-2 py-1 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ متوفر
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-3xs font-bold bg-red-50 text-red-700 border border-red-200">
                            ✕ ناقص
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.hasFr ? (
                          <span className="px-2 py-1 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ متوفر
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-3xs font-bold bg-red-50 text-red-700 border border-red-200">
                            ✕ ناقص
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.hasEn ? (
                          <span className="px-2 py-1 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ متوفر
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-3xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            ✕ ناقص
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={item.editUrl}
                          className="px-3 py-1.5 rounded-lg text-2xs font-bold bg-[#231f20] hover:bg-[#d2a82b] text-white transition-colors inline-block"
                        >
                          تعديل الترجمات ↗
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#5C5A55]">
                    لا توجد برامج أو فعاليات مسجلة حالياً لفحص ترجمتها.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
