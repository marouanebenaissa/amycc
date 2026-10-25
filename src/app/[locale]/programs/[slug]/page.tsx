import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface ProgramTranslation {
  locale: string
  title: string
  description?: string
  objectives?: string
  target_audience?: string
  activities?: string
}

interface ProgramDetail {
  slug: string
  category: string
  city?: string
  cover_image?: string | null
  program_translations?: ProgramTranslation[]
}

export async function generateStaticParams() {
  const slugs = [
    'youth-in-action',
    'arts-heritage-workshops',
    'theatre-scenic-expression',
    'musical-heritage-revival',
  ]
  const locales = ['ar', 'fr', 'en']
  const params: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }

  return params
}

export default async function ProgramDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  let program: ProgramDetail | null = null

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('programs')
      .select('*, program_translations(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (data) {
      program = data as unknown as ProgramDetail
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
        city: isAr ? 'مختلف المدن المغربية' : 'Morocco',
        cover_image: '/images/youth-in-action.jpg',
        program_translations: [
          {
            locale,
            title: isAr ? 'مبادرة شباب في العمل (Youth in Action)' : isFr ? 'Initiative Jeunesse en Action' : 'Youth in Action Initiative',
            description: isAr ? 'البرنامج التطوعي والتأطيري الرائد لجمعية روح الفنون والثقافة، الهادف إلى إدماج الشباب في الحياة الثقافية وتأطيرهم لقيادة المبادرات الإبداعية والمجتمعية.' : isFr ? 'Programme bénévole phare de l\'AMYCC engageant les jeunes dans la vie culturelle et le leadership associatif.' : 'Flagship volunteering initiative empowering youth to co-create and lead cultural and community projects.',
            objectives: isAr ? 'تأهيل 200 شاب سنوياً، صقل مهارات التواصل والقيادة المدنية، وتعزيز التضامن الثقافي.' : isFr ? 'Promouvoir l\'esprit d\'initiative et développer le leadership chez les jeunes.' : 'Promoting civic initiative and leadership skills among Moroccan youth.',
            target_audience: isAr ? 'الشباب والطلبة من 16 إلى 30 سنة من مختلف جهات المملكة المغربية.' : 'Youth & students aged 16–30',
            activities: isAr ? 'ورشات تدريبية، حملات تطوعية، تنظيم الفعاليات والمعارض الثقافية، ومشاريع خدمة المجتمع.' : isFr ? 'Ateliers de formation, actions bénévoles, organisation d\'événements culturels.' : 'Training workshops, community campaigns, and cultural event organization.'
          }
        ]
      }
    } else if (slug === 'arts-heritage-workshops') {
      program = {
        slug: 'arts-heritage-workshops',
        category: 'arts',
        city: isAr ? 'المملكة المغربية' : 'Morocco',
        cover_image: '/images/hero-art.jpg',
        program_translations: [
          {
            locale,
            title: isAr ? 'ورشات الفنون والتراث الإبداعي' : isFr ? 'Ateliers des Arts et du Patrimoine' : 'Arts & Heritage Workshops',
            description: isAr ? 'سلسلة محترفات متخصصة في الفنون التشكيلية، الرسم، الخزف، والخط العربي لاستكشاف وتثمين الموروث الجمالي المغربي العريق.' : isFr ? 'Des ateliers interactifs pour explorer les arts plastiques, le dessin et la calligraphie.' : 'Interactive workshops exploring plastic arts, Moroccan calligraphy, and heritage craftsmanship.',
            objectives: isAr ? 'صقل المواهب التشكيلية الصاعدة، إنتاج معارض جماعية، والتعريف بالتقنيات الفنية الأصيلة.' : isFr ? 'Développer les talents artistiques émergents et organiser des expositions.' : 'Nurturing emerging artistic talents and curating collective exhibitions.',
            target_audience: isAr ? 'الهواة والمبدعون الصاعدون وشباب الجمعيات الثقافية.' : 'Emerging creators and youth',
            activities: isAr ? 'محترفات الصباغة المائية والزيتية، دورات الخط المغربي، إقامات إبداعية مشتركة.' : isFr ? 'Ateliers de peinture, calligraphie, résidences artistiques.' : 'Painting sessions, calligraphy, and creative residencies.'
          }
        ]
      }
    } else if (slug === 'theatre-scenic-expression') {
      program = {
        slug: 'theatre-scenic-expression',
        category: 'theatre',
        city: isAr ? 'مراكش والجهات' : 'Marrakech & Regions',
        program_translations: [
          {
            locale,
            title: isAr ? 'برنامج المسرح وفنون الأداء التعبيري' : isFr ? 'Programme Théâtre & Arts de la Scène' : 'Theatre & Performing Arts Program',
            description: isAr ? 'تكوين مسرحي شامل يغطي فن الحكاية (الحلقة)، الإلقاء الصوتي، التعبير الحركي، وكتابة النصوص الدرامية الهادفة.' : 'Stage and performing arts training program.',
            objectives: isAr ? 'إنتاج عروض مسرحية شبابية، تنمية الثقة بالنفس، والمشاركة في المهرجانات الوطنية.' : 'Stage productions and youth talent incubation.',
            target_audience: isAr ? 'هواة المسرح والشباب المهتم بالتمثيل والإخراج.' : 'Theatre enthusiasts and performers.',
            activities: isAr ? 'تمارين الارتجال، تدريبات الإلقاء الصوتي، عروض مسرح الشارع والمسرح المدرسي.' : 'Improvisation, voice training, stage plays.'
          }
        ]
      }
    } else if (slug === 'musical-heritage-revival') {
      program = {
        slug: 'musical-heritage-revival',
        category: 'music',
        city: isAr ? 'المملكة المغربية' : 'Morocco',
        program_translations: [
          {
            locale,
            title: isAr ? 'مختبر إحياء التراث الموسيقي المغربي' : isFr ? 'Laboratoire du Patrimoine Musical Marocain' : 'Moroccan Musical Heritage Lab',
            description: isAr ? 'ورشات تدريبية للتعريف بالآلات والمقامات والإيقاعات التراثية المغربية وتوثيق الأهازيج التقليدية ونقلها للشباب.' : 'Traditional Moroccan music laboratory and documentation.',
            objectives: isAr ? 'صون التراث الشفهي الموسيقي، تدريب العازفين الشباب، وتوثيق الأنغام الأصيلة.' : 'Musical heritage preservation and youth training.',
            target_audience: isAr ? 'الموسيقيون الشباب، الباحثون في التراث، والمهتمون بالنغم المغربي الأصيل.' : 'Young musicians and heritage researchers.',
            activities: isAr ? 'دروس العزف على الآلات الوترية، تسجيلات تراثية ميدانية، حلقات استماع وتذوق نغمي.' : 'Instrument lessons, field recordings, musical listening circles.'
          }
        ]
      }
    } else {
      notFound()
    }
  }

  const translation = program.program_translations?.find((t) => t.locale === locale) || program.program_translations?.[0]

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2] py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#5f7174] mb-8">
            <Link href={`/${locale}`} className="hover:text-[#0d3b43] transition-colors">
              {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/programs`} className="hover:text-[#0d3b43] transition-colors">
              {isAr ? 'البرامج الثقافية' : isFr ? 'Programmes' : 'Programs'}
            </Link>
            <span>/</span>
            <span className="text-[#c85a32] truncate max-w-xs">{translation?.title}</span>
          </div>

          {/* Program Header Box */}
          <div className="bg-white rounded-3xl border border-[#e5e0d6] overflow-hidden shadow-card mb-8">
            {program.cover_image && (
              <div className="relative aspect-[21/9] w-full bg-[#08242a]">
                <Image
                  src={program.cover_image}
                  alt={translation?.title || ''}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="p-8 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d8f0f4] text-[#0d3b43]">
                  {program.category}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#faf7f2] border border-[#e5e0d6] text-[#5f7174]">
                  📍 {program.city || (isAr ? 'المملكة المغربية' : 'Morocco')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#08242a] tracking-tight leading-snug">
                {translation?.title}
              </h1>

              {translation?.description && (
                <p className="text-base sm:text-lg text-[#445457] leading-relaxed font-medium">
                  {translation.description}
                </p>
              )}
            </div>
          </div>

          {/* Program Details Sections */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e5e0d6] shadow-subtle space-y-8 text-[#445457] text-sm sm:text-base leading-relaxed">
            {translation?.objectives && (
              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-2">
                <h2 className="text-base sm:text-lg font-black text-[#08242a] flex items-center gap-2">
                  <span>🎯</span>
                  <span>{isAr ? 'أهداف ومخرجات البرنامج' : 'Program Objectives'}</span>
                </h2>
                <p className="leading-relaxed text-[#445457]">{translation.objectives}</p>
              </div>
            )}

            {translation?.target_audience && (
              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-2">
                <h2 className="text-base sm:text-lg font-black text-[#08242a] flex items-center gap-2">
                  <span>👥</span>
                  <span>{isAr ? 'الفئة المستهدفة وشروط المشاركة' : 'Target Audience'}</span>
                </h2>
                <p className="leading-relaxed text-[#445457]">{translation.target_audience}</p>
              </div>
            )}

            {translation?.activities && (
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-black text-[#08242a] flex items-center gap-2">
                  <span>🎨</span>
                  <span>{isAr ? 'الأنشطة والورشات المبرمجة' : 'Key Activities & Masterclasses'}</span>
                </h2>
                <p className="leading-relaxed text-[#445457]">{translation.activities}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-8 border-t border-[#f0ebe1] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  href={`/${locale}/membership`}
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-black text-white bg-[#0d3b43] hover:bg-[#08242a] active:scale-98 transition-all shadow-md text-xs sm:text-sm w-full sm:w-auto"
                >
                  {dict.membership.apply}
                </Link>

                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-[#08242a] bg-[#faf7f2] hover:bg-[#f0ebe1] border border-[#e5e0d6] transition-colors text-xs sm:text-sm w-full sm:w-auto"
                >
                  {isAr ? 'استفسر حول هذا البرنامج' : dict.nav.contact}
                </Link>
              </div>

              <Link
                href={`/${locale}/programs`}
                className="text-xs font-bold text-[#c85a32] hover:underline"
              >
                ← {isAr ? 'العودة لكافة البرامج' : 'Back to Programs'}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}
