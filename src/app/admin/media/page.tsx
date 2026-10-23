import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

interface MediaAsset {
  id: string
  title: string
  category: 'logos' | 'banners' | 'photos' | 'documents'
  url: string
  format: string
  size: string
  uploadedAt: string
}

// Default approved institutional media library
const defaultMedia: MediaAsset[] = [
  {
    id: 'm-1',
    title: 'الشعار المؤسسي المعتمد (AMYCC Official Seal Logo)',
    category: 'logos',
    url: '/logo.png',
    format: 'PNG',
    size: '124 KB',
    uploadedAt: '2026-01-15',
  },
  {
    id: 'm-2',
    title: 'صورة مبادرة شباب في العمل (Youth in Action Spotlight)',
    category: 'banners',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    format: 'JPEG',
    size: '420 KB',
    uploadedAt: '2026-02-10',
  },
  {
    id: 'm-3',
    title: 'صورة ورشة الفنون والمسرح (Performing Arts Workshop)',
    category: 'photos',
    url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
    format: 'JPEG',
    size: '380 KB',
    uploadedAt: '2026-03-01',
  },
  {
    id: 'm-4',
    title: 'صورة الموسيقى والتراث المغربي (Heritage Music Session)',
    category: 'photos',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    format: 'JPEG',
    size: '510 KB',
    uploadedAt: '2026-03-12',
  },
  {
    id: 'm-5',
    title: 'صورة الملتقى الثقافي السنوي (Annual Cultural Gathering)',
    category: 'photos',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    format: 'JPEG',
    size: '460 KB',
    uploadedAt: '2026-04-05',
  },
]

export default async function AdminMediaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch custom media from site_settings or database if stored
  const { data: settingData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'custom_media_library')
    .maybeSingle()

  const customMedia = (settingData?.value as MediaAsset[]) || []
  const allMedia = [...defaultMedia, ...customMedia]

  async function handleAddMedia(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const category = (formData.get('category') as MediaAsset['category']) || 'photos'
    const url = formData.get('url') as string
    const format = (formData.get('format') as string) || 'JPEG'

    if (!title || !url) return

    const newAsset: MediaAsset = {
      id: `m-${Date.now()}`,
      title,
      category,
      url,
      format: format.toUpperCase(),
      size: '250 KB',
      uploadedAt: new Date().toISOString().split('T')[0],
    }

    const sb = await createClient()
    const { data: existing } = await sb
      .from('site_settings')
      .select('value')
      .eq('key', 'custom_media_library')
      .maybeSingle()

    const currentList = (existing?.value as MediaAsset[]) || []
    await sb.from('site_settings').upsert([
      {
        key: 'custom_media_library',
        value: [...currentList, newAsset],
        updated_at: new Date().toISOString(),
      },
    ])
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-2xs font-bold text-[#c85a32] uppercase tracking-wider mb-1">
            <span>مكتبة الأصول الرقمية</span>
            <span>•</span>
            <span>Digital Assets & Approved Media</span>
          </div>
          <h1 className="text-2xl font-black text-[#08242a]">
            مكتبة الوسائط والصور المعتمدة
          </h1>
          <p className="text-xs text-[#5f7174] mt-1 max-w-2xl">
            إدارة كافة الصور، الشعارات، والوسائط الرقمية المعتمدة رسمياً للنشر في المقالات والبرامج وصفحات المنصة، مع روابط وصول مباشرة ومحمية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#08242a] shadow-2xs">
            إجمالي الأصول: {allMedia.length}
          </span>
        </div>
      </div>

      {/* Upload / Register New Media Asset Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <h2 className="text-xs font-bold text-[#08242a] mb-4 uppercase tracking-wider flex items-center gap-2">
          <span>➕</span>
          <span>تسجيل أصل رقمي جديد في المكتبة / Register New Approved Asset</span>
        </h2>

        <form action={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-3xs font-bold text-[#08242a] mb-1">
              عنوان أو وصف الصورة / Asset Title:
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="مثال: ورشة المسرح بالرباط - ربيع 2026"
              className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
            />
          </div>

          <div>
            <label className="block text-3xs font-bold text-[#08242a] mb-1">
              التصنيف / Category:
            </label>
            <select
              name="category"
              className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#faf7f2] font-semibold text-[#08242a]"
            >
              <option value="photos">صور فعاليات (Photos)</option>
              <option value="banners">بنرات رئيسية (Banners)</option>
              <option value="logos">شعارات وأختام (Logos)</option>
              <option value="documents">مستندات وتقارير (Documents)</option>
            </select>
          </div>

          <div>
            <label className="block text-3xs font-bold text-[#08242a] mb-1">
              صيغة الملف / Format:
            </label>
            <select
              name="format"
              className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#faf7f2] font-semibold text-[#08242a]"
            >
              <option value="JPEG">JPEG</option>
              <option value="PNG">PNG</option>
              <option value="WEBP">WEBP</option>
              <option value="PDF">PDF</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-3xs font-bold text-[#08242a] mb-1">
              رابط الصورة المباشر أو مسار التخزين / Public CDN or Asset URL:
            </label>
            <input
              type="url"
              name="url"
              required
              placeholder="https://... أو /logo.png"
              className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0d3b43] hover:bg-[#14505b] text-white transition-all shadow-subtle active:scale-98"
            >
              إضافة إلى المكتبة +
            </button>
          </div>
        </form>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allMedia.map((asset) => {
          return (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-[#08242a]/5 overflow-hidden">
                {asset.url.startsWith('/') || asset.url.startsWith('http') ? (
                  <Image
                    src={asset.url}
                    alt={asset.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-slate-300">
                    🖼️
                  </div>
                )}
                <span className="absolute top-2 end-2 px-2 py-0.5 rounded-full text-4xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                  {asset.format}
                </span>
              </div>

              {/* Asset Info */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-4xs font-bold bg-[#faf7f2] border border-[#e5e0d6] text-[#08242a]">
                      {asset.category}
                    </span>
                    <span className="text-4xs text-[#819598] font-mono">{asset.size}</span>
                  </div>

                  <h3 className="text-xs font-bold text-[#08242a] line-clamp-2 leading-snug">
                    {asset.title}
                  </h3>
                </div>

                <div className="pt-3 mt-3 border-t border-[#f4ede2] flex items-center justify-between gap-2">
                  <span className="text-4xs text-[#819598] font-mono">
                    {asset.uploadedAt}
                  </span>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg text-3xs font-bold bg-[#faf7f2] hover:bg-[#0d3b43] hover:text-white text-[#08242a] border border-[#e5e0d6] transition-colors"
                  >
                    معاينة الرابط ↗
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
