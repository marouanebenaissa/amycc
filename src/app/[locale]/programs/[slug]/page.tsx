import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return [
    { locale: 'ar', slug: 'youth-in-action' },
    { locale: 'fr', slug: 'youth-in-action' },
    { locale: 'en', slug: 'youth-in-action' },
    { locale: 'ar', slug: 'arts-heritage-workshops' },
    { locale: 'fr', slug: 'arts-heritage-workshops' },
    { locale: 'en', slug: 'arts-heritage-workshops' },
  ]
}

export default async function ProgramDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const dict = await getDictionary(locale)

  let program: any = null

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('programs')
      .select('*, program_translations(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (data) {
      program = data
    }
  } catch {
    // Fallback
  }

  // Fallback program data
  if (!program) {
    if (slug === 'youth-in-action') {
      program = {
        slug: 'youth-in-action',
        category: 'youth',
        city: 'Morocco',
        program_translations: [
          {
            locale,
            title: locale === 'ar' ? 'مبادرة شباب في العمل' : locale === 'fr' ? 'Initiative Jeunesse en Action' : 'Youth in Action Initiative',
            description: locale === 'ar' ? 'مبادرة تطوعية تهدف إلى إشراك الشباب في الأنشطة الثقافية والمجتمعية والتنموية.' : locale === 'fr' ? 'Une initiative bénévole visant à engager les jeunes dans des activités culturelles et communautaires.' : 'A volunteering initiative aiming to engage youth in cultural and community activities.',
            objectives: locale === 'ar' ? 'تعزيز روح المبادرة والعمل التطوعي، وصقل مهارات التواصل والقيادة لدى الشباب المغربي.' : locale === 'fr' ? 'Promouvoir l\'esprit d\'initiative et développer le leadership chez les jeunes.' : 'Promoting civic initiative and leadership skills among Moroccan youth.',
            activities: locale === 'ar' ? 'ورشات تدريبية، حملات تطوعية، تنظيم الفعاليات الثقافية، ومشاريع خدمة المجتمع.' : locale === 'fr' ? 'Ateliers de formation, actions bénévoles, organisation d\'événements culturels.' : 'Training workshops, community campaigns, and cultural event organization.'
          }
        ]
      }
    } else if (slug === 'arts-heritage-workshops') {
      program = {
        slug: 'arts-heritage-workshops',
        category: 'arts',
        city: 'Morocco',
        program_translations: [
          {
            locale,
            title: locale === 'ar' ? 'ورشات الفنون والتراث' : locale === 'fr' ? 'Ateliers des Arts et du Patrimoine' : 'Arts & Heritage Workshops',
            description: locale === 'ar' ? 'ورشات تفاعلية لاستكشاف الفنون التشكيلية والمسرح والموسيقى وصون التراث المغربي الأصيل.' : locale === 'fr' ? 'Des ateliers interactifs pour explorer les arts plastiques, le théâtre et la musique.' : 'Interactive workshops exploring plastic arts, theatre, and Moroccan music.',
            objectives: locale === 'ar' ? 'تنمية المواهب الفنية الصاعدة وتشجيع التعبير الثقافي المتنوع.' : locale === 'fr' ? 'Développer les talents artistiques émergents.' : 'Nurturing emerging artistic talents.',
            activities: locale === 'ar' ? 'محترفات المسرح، ورشات الرسم والنحت، جلسات التعبير الموسيقي.' : locale === 'fr' ? 'Ateliers de théâtre, peinture, musique.' : 'Theatre sessions, painting, and music.'
          }
        ]
      }
    } else {
      notFound()
    }
  }

  const translation = program.program_translations?.find((t: any) => t.locale === locale) || program.program_translations?.[0]

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href={`/${locale}/programs`}
            className="inline-flex items-center text-xs font-bold text-[#0068ff] hover:underline mb-8"
          >
            ← {locale === 'ar' ? 'العودة إلى جميع البرامج' : 'Back to all programs'}
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0068ff]">
              {program.category}
            </span>
            <span className="text-xs text-slate-400">• {program.city || 'Morocco'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mb-6">
            {translation?.title}
          </h1>

          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-8">
            <div>
              <h2 className="text-lg font-bold text-[#0a0f1d] mb-2">
                {locale === 'ar' ? 'نظرة عامة على البرنامج' : 'Program Overview'}
              </h2>
              <p className="text-slate-600 leading-relaxed">{translation?.description}</p>
            </div>

            {translation?.objectives && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h2 className="text-lg font-bold text-[#0a0f1d] mb-2">
                  {locale === 'ar' ? 'أهداف البرنامج' : 'Program Objectives'}
                </h2>
                <p className="text-slate-600 leading-relaxed">{translation.objectives}</p>
              </div>
            )}

            {translation?.activities && (
              <div>
                <h2 className="text-lg font-bold text-[#0a0f1d] mb-2">
                  {locale === 'ar' ? 'الأنشطة المبرمجة' : 'Key Activities'}
                </h2>
                <p className="text-slate-600 leading-relaxed">{translation.activities}</p>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/volunteer`}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-[#0068ff] hover:bg-[#0054d1] transition-all shadow-sm"
              >
                {dict.volunteer.apply}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {dict.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}
