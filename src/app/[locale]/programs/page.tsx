import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import Link from 'next/link'

export default async function ProgramsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  let programs: any[] = []

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('programs')
      .select('id, slug, category, city, program_translations!inner(title, description, objectives)')
      .eq('status', 'published')
      .eq('program_translations.locale', locale)

    if (data && data.length > 0) {
      programs = data
    }
  } catch {
    // Graceful fallback if database is not reachable yet
  }

  // Built-in fallback sample programs if none queried yet
  const defaultPrograms = [
    {
      id: '1',
      slug: 'youth-in-action',
      category: 'youth',
      city: 'Morocco',
      program_translations: [
        {
          title: locale === 'ar' ? 'مبادرة شباب في العمل' : locale === 'fr' ? 'Initiative Jeunesse en Action' : 'Youth in Action Initiative',
          description: locale === 'ar' ? 'مبادرة تطوعية تهدف إلى إشراك الشباب في الأنشطة الثقافية والمجتمعية.' : locale === 'fr' ? 'Une initiative bénévole visant à engager les jeunes dans des activités culturelles.' : 'A volunteering initiative aiming to engage youth in cultural activities.',
        },
      ],
    },
    {
      id: '2',
      slug: 'arts-heritage-workshops',
      category: 'arts',
      city: 'Morocco',
      program_translations: [
        {
          title: locale === 'ar' ? 'ورشات الفنون والتراث' : locale === 'fr' ? 'Ateliers des Arts et du Patrimoine' : 'Arts & Heritage Workshops',
          description: locale === 'ar' ? 'ورشات تفاعلية لاستكشاف الفنون التشكيلية والمسرح والموسيقى.' : locale === 'fr' ? 'Des ateliers interactifs pour explorer les arts plastiques, le théâtre et la musique.' : 'Interactive workshops exploring visual arts, theatre, and music.',
        },
      ],
    },
  ]

  const displayPrograms = programs.length > 0 ? programs : defaultPrograms

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-white">
        {/* Page Header */}
        <div className="bg-slate-50 border-b border-slate-100 py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0068ff]">AMYCC</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mt-2 mb-4">
              {dict.programs.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {dict.hero.subtitle}
            </p>
          </div>
        </div>

        {/* Programs Listing Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayPrograms.map((prog) => {
              const trans = prog.program_translations?.[0] || {}
              return (
                <div
                  key={prog.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0068ff]">
                        {prog.category || 'Culture'}
                      </span>
                      <span className="text-xs text-slate-400">{prog.city || 'Morocco'}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0a0f1d] mb-3">{trans.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{trans.description}</p>
                  </div>
                  <div>
                    <Link
                      href={`/${locale}/volunteer`}
                      className="inline-flex items-center text-sm font-bold text-[#0068ff] hover:text-[#0054d1]"
                    >
                      {dict.programs.learn_more} →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}
