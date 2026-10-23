import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import Link from 'next/link'

interface ProgramListItem {
  id: string
  slug: string
  category: string
  city?: string | null
  program_translations?: {
    title: string
    description?: string | null
    objectives?: string | null
    target_audience?: string | null
  }[]
}

export default async function ProgramsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  let programs: ProgramListItem[] = []

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('programs')
      .select('id, slug, category, city, program_translations!inner(title, description, objectives, target_audience)')
      .eq('status', 'published')
      .eq('program_translations.locale', locale)

    if (data && data.length > 0) {
      programs = data as unknown as ProgramListItem[]
    }
  } catch {
    // Graceful fallback during build
  }

  // Fallback initial programs if none in DB yet
  const defaultPrograms: ProgramListItem[] = [
    {
      id: 'p-1',
      slug: 'youth-in-action',
      category: 'youth',
      city: isAr ? 'مختلف المدن المغربية' : 'Morocco',
      program_translations: [
        {
          title: isAr ? 'مبادرة شباب في العمل (Youth in Action)' : isFr ? 'Initiative Jeunesse en Action' : 'Youth in Action Initiative',
          description: isAr
            ? 'البرنامج التطوعي الرائد للجمعية الهادف إلى إدماج الشباب في الحياة الثقافية وتأطيرهم لقيادة المبادرات الإبداعية والمجتمعية.'
            : isFr
            ? 'Programme bénévole phare de l\'AMYCC engageant les jeunes dans la vie culturelle et le leadership associatif.'
            : 'Flagship volunteering initiative empowering youth to co-create and lead cultural and community projects.',
          objectives: isAr ? 'تأهيل 200 شاب سنوياً، تنمية المهارات الحياتية، وتعزيز المشاركة المدنية' : 'Skill building, cultural leadership, civic solidarity.',
          target_audience: isAr ? 'الشباب والطلبة من 16 إلى 30 سنة' : 'Youth & students aged 16–30',
        },
      ],
    },
    {
      id: 'p-2',
      slug: 'arts-heritage-workshops',
      category: 'arts',
      city: isAr ? 'المملكة المغربية' : 'Morocco',
      program_translations: [
        {
          title: isAr ? 'ورشات الفنون والتراث الإبداعي' : isFr ? 'Ateliers des Arts et du Patrimoine' : 'Arts & Creative Heritage Workshops',
          description: isAr
            ? 'سلسلة ورشات متخصصة في الفنون التشكيلية، الرسم، الخزف، والتصوير الفوتوغرافي لاستكشاف الموروث الجمالي المغربي.'
            : isFr
            ? 'Série d\'ateliers spécialisés en arts plastiques et photographie explorant le patrimoine visuel marocain.'
            : 'Specialized masterclasses in visual arts and photography exploring the rich Moroccan visual heritage.',
          objectives: isAr ? 'صقل المواهب التشكيلية، إنتاج معارض جماعية، والتعريف بالتقنيات الفنية' : 'Talent development, group exhibitions, technique mastery.',
          target_audience: isAr ? 'الهواة والمبدعون الصاعدون' : 'Emerging artists & creators',
        },
      ],
    },
    {
      id: 'p-3',
      slug: 'theatre-scenic-expression',
      category: 'theatre',
      city: isAr ? 'المملكة المغربية' : 'Morocco',
      program_translations: [
        {
          title: isAr ? 'برنامج المسرح وفنون الأداء التعبيري' : isFr ? 'Programme Théâtre & Arts de la Scène' : 'Theatre & Performing Arts Program',
          description: isAr
            ? 'تكوين مسرحي شامل يغطي فن الحكاية، الإلقاء الصوتي، التعبير الحركي، وكتابة النصوص الدرامية الهادفة.'
            : isFr
            ? 'Formation théâtrale couvrant le conte, la diction, le jeu corporel et l\'écriture dramatique.'
            : 'Comprehensive stage training covering storytelling, voice control, dramatic writing, and stage presence.',
          objectives: isAr ? 'إنتاج عروض مسرحية شبابية والمشاركة في المهرجانات الوطنية' : 'Stage play productions and participation in youth festivals.',
          target_audience: isAr ? 'هواة المسرح والشباب المهتم بالتمثيل' : 'Theatre enthusiasts & performers',
        },
      ],
    },
    {
      id: 'p-4',
      slug: 'musical-heritage-revival',
      category: 'music',
      city: isAr ? 'المملكة المغربية' : 'Morocco',
      program_translations: [
        {
          title: isAr ? 'مختبر إحياء التراث الموسيقي المغربي' : isFr ? 'Laboratoire du Patrimoine Musical Marocain' : 'Moroccan Musical Heritage Lab',
          description: isAr
            ? 'ورشات تدريبية للتعريف بالآلات والمقامات والإيقاعات التراثية المغربية وتوثيق الأهازيج التقليدية.'
            : isFr
            ? 'Ateliers de pratique instrumentale traditionnelle et de documentation des rythmes du terroir marocain.'
            : 'Instrumental masterclasses focusing on traditional Moroccan scales, rhythms, and folkloric melodies.',
          objectives: isAr ? 'صون التراث الشفهي الموسيقي وتدريب العازفين الشباب' : 'Oral music heritage preservation & youth music training.',
          target_audience: isAr ? 'الموسيقيون والمهتمون بالتراث' : 'Young musicians & heritage lovers',
        },
      ],
    },
  ]

  const displayPrograms = programs.length > 0 ? programs : defaultPrograms

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC Programs
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.programs.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {dict.home.areas_subtitle}
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#e5e0d6]">
            <div>
              <h2 className="text-xl font-black text-[#08242a]">
                {isAr ? 'دليل البرامج والمبادرات الثقافية' : 'Programs & Initiatives Directory'}
              </h2>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'مبادرات فنية مستمرة وتكوينات دورية' : 'Ongoing artistic and educational projects'}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#e5e0d6] text-[#08242a] shadow-2xs">
              {displayPrograms.length} {isAr ? 'برامج معتمدة' : 'Programs'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayPrograms.map((prog) => {
              const trans = prog.program_translations?.[0] || { title: prog.slug }
              return (
                <div
                  key={prog.id}
                  className="rounded-3xl border border-[#e5e0d6] bg-white p-8 shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider bg-[#d8f0f4] text-[#0d3b43]">
                        {prog.category}
                      </span>
                      <span className="text-3xs text-[#5f7174] font-medium flex items-center gap-1">
                        <span>📍</span>
                        <span>{prog.city || 'Morocco'}</span>
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#08242a] mb-3 leading-snug">
                      {trans.title}
                    </h3>

                    {trans.description && (
                      <p className="text-xs sm:text-sm text-[#445457] leading-relaxed mb-6">
                        {trans.description}
                      </p>
                    )}

                    {/* Objectives & Audience details */}
                    <div className="space-y-2.5 p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] mb-6 text-2xs">
                      {trans.objectives && (
                        <div>
                          <span className="font-bold text-[#08242a] block">
                            {isAr ? 'الأهداف الرئيسية:' : 'Key Objectives:'}
                          </span>
                          <span className="text-[#5f7174]">{trans.objectives}</span>
                        </div>
                      )}
                      {trans.target_audience && (
                        <div>
                          <span className="font-bold text-[#08242a] block">
                            {isAr ? 'الفئة المستهدفة:' : 'Target Audience:'}
                          </span>
                          <span className="text-[#5f7174]">{trans.target_audience}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#f4ede2] flex items-center justify-between">
                    <Link
                      href={`/${locale}/programs/${prog.slug}`}
                      className="inline-flex items-center text-xs font-bold text-[#c85a32] hover:text-[#b84e27] transition-colors"
                    >
                      <span>{dict.programs.learn_more}</span>
                      <span aria-hidden="true" className="ms-1">→</span>
                    </Link>

                    <Link
                      href={`/${locale}/volunteer`}
                      className="px-4 py-2 rounded-xl text-3xs font-bold text-[#0d3b43] bg-[#faf7f2] hover:bg-[#0d3b43] hover:text-white border border-[#e5e0d6] transition-all"
                    >
                      {isAr ? 'تطوع في هذا البرنامج' : 'Volunteer Here'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Suggest Program CTA */}
        <section className="bg-white border-t border-[#e5e0d6] py-16 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <h2 className="text-2xl font-black text-[#08242a]">
              {isAr ? 'هل لديك فكرة مشروع ثقافي أو مبادرة تود إطلاقها معنا؟' : 'Have a Creative Idea to Launch With Us?'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5f7174] max-w-xl mx-auto leading-relaxed">
              {isAr
                ? 'توفر الجمعية التأطير والمواكبة والشبكة المؤسساتية للمشاريع الإبداعية الهادفة لخدمة المجتمع.'
                : 'AMYCC provides organizational backing and mentorship to impactful community arts projects.'}
            </p>
            <div className="pt-2">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#0d3b43] hover:bg-[#14505b] transition-all shadow-subtle gap-2"
              >
                <span>{dict.nav.contact}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}
