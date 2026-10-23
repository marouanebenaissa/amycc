import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface SiteSettingRow {
  key: string
  value: Record<string, unknown>
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: settings } = await supabase.from('site_settings').select('*')
  const settingsMap: Record<string, unknown> = {}
  if (settings) {
    (settings as SiteSettingRow[]).forEach((s) => {
      settingsMap[s.key] = s.value
    })
  }

  async function handleSaveSettings(formData: FormData) {
    'use server'
    const sb = await createClient()
    const contactEmail = (formData.get('contactEmail') as string) || ''
    const contactPhone = (formData.get('contactPhone') as string) || ''
    const contactAddress = (formData.get('contactAddress') as string) || ''
    const facebookUrl = (formData.get('facebookUrl') as string) || ''
    const instagramUrl = (formData.get('instagramUrl') as string) || ''

    await sb.from('site_settings').upsert([
      { key: 'contact_info', value: { email: contactEmail, phone: contactPhone, address: contactAddress } },
      { key: 'social_links', value: { facebook: facebookUrl, instagram: instagramUrl } },
    ])

    revalidatePath('/admin/settings')
  }

  const contactVal = (settingsMap['contact_info'] as Record<string, string>) || {}
  const socialVal = (settingsMap['social_links'] as Record<string, string>) || {}

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[#08242a]">Platform & Site Settings</h1>
        <p className="text-xs text-[#5f7174] mt-1">
          Manage general association information, official contact channels, and system configuration.
        </p>
      </div>

      {/* Organization Identity Overview */}
      <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-[#08242a] uppercase tracking-wider">
          Official Identity & Charter Data
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#2d3b3e]">
          <div>
            <span className="block text-[#819598] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (Arabic)</span>
            <span className="font-bold text-sm text-[#08242a]">جمعية روح الفنون والثقافة</span>
          </div>
          <div>
            <span className="block text-[#819598] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (English)</span>
            <span className="font-bold text-sm text-[#08242a]">Spirit of Arts & Culture Association</span>
          </div>
          <div>
            <span className="block text-[#819598] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (French)</span>
            <span className="font-bold text-sm text-[#08242a]">Association Esprit des Arts et de la Culture</span>
          </div>
          <div>
            <span className="block text-[#819598] font-bold text-3xs uppercase tracking-wider mb-1">Abbreviation & Scope</span>
            <span className="font-bold text-sm text-[#0d3b43]">AMYCC (Founded 2026, Morocco)</span>
          </div>
        </div>
      </div>

      {/* Editable Contact & Social Information Form */}
      <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <h2 className="text-sm font-bold text-[#08242a] mb-6 uppercase tracking-wider">
          Official Channels & Social Links
        </h2>

        <form action={handleSaveSettings} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-bold text-[#445457] mb-1">
                Official Contact Email
              </label>
              <input
                name="contactEmail"
                type="email"
                defaultValue={contactVal.email || 'contact@amycc.org'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-[#445457] mb-1">
                Official Telephone Number
              </label>
              <input
                name="contactPhone"
                type="tel"
                defaultValue={contactVal.phone || '+212 500-000000'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-bold text-[#445457] mb-1">
              Registered Association Office / City
            </label>
            <input
              name="contactAddress"
              type="text"
              defaultValue={contactVal.address || 'Morocco / المملكة المغربية'}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-2xs font-bold text-[#445457] mb-1">
                Facebook Page URL
              </label>
              <input
                name="facebookUrl"
                type="url"
                defaultValue={socialVal.facebook || 'https://facebook.com/amycc'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-[#445457] mb-1">
                Instagram Profile URL
              </label>
              <input
                name="instagramUrl"
                type="url"
                defaultValue={socialVal.instagram || 'https://instagram.com/amycc'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 rounded-xl transition-all shadow-subtle hover:shadow-card"
            >
              Save Platform Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
