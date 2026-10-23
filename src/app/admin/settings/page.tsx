import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: settings } = await supabase.from('site_settings').select('*')

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a0f1d]">Site Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage general association information, branding defaults, and metadata.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-[#0a0f1d]">Organization Identity</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
          <div>
            <span className="block text-slate-400 font-semibold mb-1">Official Name (Arabic)</span>
            <span className="font-bold text-sm text-[#0a0f1d]">جمعية روح الفنون والثقافة</span>
          </div>
          <div>
            <span className="block text-slate-400 font-semibold mb-1">Official Name (English)</span>
            <span className="font-bold text-sm text-[#0a0f1d]">Spirit of Arts & Culture Association</span>
          </div>
          <div>
            <span className="block text-slate-400 font-semibold mb-1">Official Name (French)</span>
            <span className="font-bold text-sm text-[#0a0f1d]">Association Esprit des Arts et de la Culture</span>
          </div>
          <div>
            <span className="block text-slate-400 font-semibold mb-1">Abbreviation & Foundation</span>
            <span className="font-bold text-sm text-[#0068ff]">AMYCC (2026)</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-[#0a0f1d] mb-2">Stored Settings Keys in Supabase</h3>
          <div className="bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-600">
            {settings && settings.length > 0 ? (
              <pre>{JSON.stringify(settings, null, 2)}</pre>
            ) : (
              <p>Default configuration active.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
