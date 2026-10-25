import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getImpactSettings, defaultImpactConfig } from '@/lib/settings'
import { ImpactManager } from '@/components/admin/ImpactManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function AdminImpactPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const initialConfig = await getImpactSettings()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#08242a] tracking-tight">
            إدارة الأثر المجتمعي (Community Impact CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#5f7174] mt-1">
            التحكم في واجهة الأثر، مؤشرات الإنجاز، المحاور الاستراتيجية، قصة شباب في العمل، ودليل النزاهة والشفافية.
          </p>
        </div>
      </div>

      <ImpactManager
        initialConfig={initialConfig}
        defaultConfig={defaultImpactConfig}
      />
    </div>
  )
}
