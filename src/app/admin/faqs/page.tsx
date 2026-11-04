import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getFaqSettings, defaultFaqConfig } from '@/lib/settings'
import { FaqManager } from '@/components/admin/FaqManager'

export const dynamic = 'force-dynamic'

export default async function AdminFaqsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const faqSettings = await getFaqSettings()

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-3xs font-bold text-[#5C5A55] mb-1">
            <Link href="/admin" className="hover:text-[#231f20] transition-colors">لوحة التحكم</Link>
            <span>/</span>
            <Link href="/admin/pages" className="hover:text-[#231f20] transition-colors">الصفحات والأقسام</Link>
            <span>/</span>
            <span className="text-[#231f20]">الأسئلة الشائعة (FAQ)</span>
          </div>
          <h1 className="text-2xl font-black text-[#231f20] tracking-tight">
            الأسئلة الشائعة — Foire Aux Questions
          </h1>
          <p className="text-xs text-[#5C5A55] mt-1">
            تحكم ديناميكي كامل في بنك الأسئلة الشائعة، ترتيبها، وترجماتها، مع اختيار ما يظهر في الواجهة الرئيسية.
          </p>
        </div>

        {/* Public Preview Links */}
        <div className="flex items-center gap-2">
          <span className="text-3xs text-[#5C5A55] font-bold">معاينة الواجهة:</span>
          <Link
            href="/ar/faq"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#231f20] hover:text-white text-3xs font-bold text-[#231f20] transition-all shadow-2xs"
          >
            عربي ↗
          </Link>
          <Link
            href="/fr/faq"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#231f20] hover:text-white text-3xs font-bold text-[#231f20] transition-all shadow-2xs"
          >
            FR ↗
          </Link>
          <Link
            href="/en/faq"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#231f20] hover:text-white text-3xs font-bold text-[#231f20] transition-all shadow-2xs"
          >
            EN ↗
          </Link>
        </div>
      </div>

      {/* Main Interactive Manager */}
      <FaqManager
        initialItems={faqSettings.items}
        defaultItems={defaultFaqConfig.items}
      />
    </div>
  )
}
