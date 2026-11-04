import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  getTeamSettings,
  defaultTeamConfig,
  getCommissionsSettings,
  defaultCommissionsConfig,
} from '@/lib/settings'
import { TeamAdminTabs } from '@/components/admin/TeamAdminTabs'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const teamConfig = await getTeamSettings()
  const commissionsConfig = await getCommissionsSettings()

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
            <span className="text-[#231f20]">فريق العمل واللجان (Team & Commissions)</span>
          </div>
          <h1 className="text-2xl font-black text-[#231f20] tracking-tight">
            هيكلة الفريق واللجان الوظيفية المتخصصة — Team & Commissions CMS
          </h1>
          <p className="text-xs text-[#5C5A55] mt-1">
            إدارة متكاملة لأعضاء المكتب التنفيذي ورفع صورهم، إلى جانب التحكم الكامل في اللجان الوظيفية الست وتدخلاتها الميدانية.
          </p>
        </div>

        {/* Public Preview Links */}
        <div className="flex items-center gap-2">
          <span className="text-3xs text-[#5C5A55] font-bold">معاينة الواجهة العامة:</span>
          <Link
            href="/ar/team"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#231f20] hover:text-white text-3xs font-bold text-[#231f20] transition-all shadow-2xs"
          >
            عربي ↗
          </Link>
          <Link
            href="/fr/team"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#231f20] hover:text-white text-3xs font-bold text-[#231f20] transition-all shadow-2xs"
          >
            FR ↗
          </Link>
          <Link
            href="/en/team"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#231f20] hover:text-white text-3xs font-bold text-[#231f20] transition-all shadow-2xs"
          >
            EN ↗
          </Link>
        </div>
      </div>

      {/* Main Interactive Manager with Tabs */}
      <TeamAdminTabs
        teamConfig={teamConfig}
        commissionsConfig={commissionsConfig}
        defaultTeamMembers={defaultTeamConfig.members}
        defaultCommissions={defaultCommissionsConfig.items}
      />
    </div>
  )
}

