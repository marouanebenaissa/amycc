import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import Image from 'next/image'

interface GalleryItem {
  id: string
  title: string
  description?: string | null
  image_url: string
  category: string
  created_at: string
}

export default async function GalleryPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  let galleryItems: GalleryItem[] = []

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('gallery_items')
      .select('id, title, description, image_url, category, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      galleryItems = data as unknown as GalleryItem[]
    }
  } catch {
    // Fallback
  }

  // Initial curated photography representing AMYCC's cultural themes
  const defaultItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: isAr ? 'مبادرة شباب في العمل — ورشة القيادة الثقافية' : isFr ? 'Jeunesse en Action — Leadership Culturel' : 'Youth in Action Cultural Leadership',
      description: isAr ? 'شباب متطوع في تأطير وتنظيم التظاهرات الفنية والتنشيط المجتمعي.' : 'Youth volunteers organizing cultural community initiatives.',
      image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      category: 'youth',
      created_at: '2026-02-15',
    },
    {
      id: 'g-2',
      title: isAr ? 'المسرح وفنون الأداء التعبيري' : isFr ? 'Théâtre et Expression Scénique' : 'Theatre & Performing Arts Workshop',
      description: isAr ? 'تدريبات مسرحية على التعبير الركحي والإلقاء الصوتي للشباب.' : 'Dramatic stage training and vocal projection masterclass.',
      image_url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
      category: 'theatre',
      created_at: '2026-03-01',
    },
    {
      id: 'g-3',
      title: isAr ? 'التراث الموسيقي المغربي الأصيل' : isFr ? 'Patrimoine Musical Marocain' : 'Moroccan Heritage Music Session',
      description: isAr ? 'جلسات استماع وتدريب على الآلات التراثية والمقامات المغربية.' : 'Acoustic sessions exploring Moroccan traditional musical heritage.',
      image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      category: 'music',
      created_at: '2026-03-18',
    },
    {
      id: 'g-4',
      title: isAr ? 'ورشة الفنون التشكيلية والتعبير البصري' : isFr ? 'Atelier des Arts Plastiques' : 'Visual Arts & Painting Workshop',
      description: isAr ? 'استكشاف الألوان والموتيفات الهندسية المغربية برؤية معاصرة.' : 'Exploring colors and Moroccan geometric patterns through contemporary art.',
      image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
      category: 'arts',
      created_at: '2026-04-05',
    },
    {
      id: 'g-5',
      title: isAr ? 'الملتقى الثقافي والتواصل المجتمعي' : isFr ? 'Forum Culturel et Échange Communautaire' : 'Cultural Gathering & Community Dialogue',
      description: isAr ? 'حوارات مفتوحة حول دور الفنون في تقوية الروابط المجتمعية.' : 'Open dialogues on the power of arts in strengthening community bonds.',
      image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      category: 'events',
      created_at: '2026-04-20',
    },
    {
      id: 'g-6',
      title: isAr ? 'التراث المعماري والهوية البصرية المغربية' : isFr ? 'Patrimoine Architectural Marocain' : 'Moroccan Architectural Heritage',
      description: isAr ? 'توثيق الجماليات والزخارف المغربية الأصيلة وإلهامها للإبداع المعاصر.' : 'Documenting authentic Moroccan aesthetics inspiring modern creators.',
      image_url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
      category: 'culture',
      created_at: '2026-05-10',
    },
  ]

  const displayItems = galleryItems.length > 0 ? galleryItems : defaultItems

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC Media Gallery
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.gallery.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {isAr
                ? 'توثيق بصري لأنشطة وورشات وفعاليات جمعية روح الفنون والثقافة ومبادرة شباب في العمل.'
                : 'Visual documentation of AMYCC cultural workshops, performing arts, and Youth in Action initiatives.'}
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#e5e0d6]">
            <div>
              <h2 className="text-xl font-black text-[#08242a]">
                {isAr ? 'الأرشيف البصري المعتمد' : 'Approved Visual Archive'}
              </h2>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'صور رسمية توثق الحراك الثقافي' : 'Official imagery documenting cultural life'}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#e5e0d6] text-[#08242a] shadow-2xs">
              {displayItems.length} {isAr ? 'صور موثقة' : 'Photos'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-[#e5e0d6] bg-white overflow-hidden shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between group"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[4/3] w-full bg-[#08242a]/10 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-3 end-3 px-2.5 py-0.5 rounded-full text-4xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-base font-bold text-[#08242a] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-[#445457] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="pt-4 mt-4 border-t border-[#f4ede2] flex items-center justify-between text-3xs text-[#819598]">
                    <span>📅 {item.created_at}</span>
                    <span className="font-bold text-[#0d3b43]">AMYCC Morocco</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}
