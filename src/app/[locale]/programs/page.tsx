import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { getProgramsPageSettings, defaultProgramsPageConfig } from '@/lib/settings'
import { ProgramsCatalog, type ProgramDisplayItem } from '@/components/programs/ProgramsCatalog'
import Link from 'next/link'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export const dynamic = 'force-dynamic'

interface RawProgramItem {
  id: string
  slug: string
  category: string
  city?: string | null
  cover_image?: string | null
  start_date?: string | null
  end_date?: string | null
  program_translations?: {
    title: string
    description?: string | null
    objectives?: string | null
    target_audience?: string | null
    activities?: string | null
  }[]
}

export default async function ProgramsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const [dict, pageSettings] = await Promise.all([
    getDictionary(locale),
    getProgramsPageSettings(),
  ])

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const hero = pageSettings.hero || defaultProgramsPageConfig.hero
  const stats = pageSettings.stats || defaultProgramsPageConfig.stats
  const cta = pageSettings.cta || defaultProgramsPageConfig.cta

  const hasHeroImage = Boolean(hero.showImage !== false && hero.imageUrl && hero.imageUrl.trim() !== '')

  // Trilingual values for Hero
  const heroTag = isAr ? hero.tagAr : isFr ? (hero.tagFr || hero.tagAr) : (hero.tagEn || hero.tagAr)
  const heroBadge = isAr ? hero.badgeAr : isFr ? (hero.badgeFr || hero.badgeAr) : (hero.badgeEn || hero.badgeAr)
  const heroTitle = isAr ? hero.titleAr : isFr ? (hero.titleFr || hero.titleAr) : (hero.titleEn || hero.titleAr)
  const heroDesc = isAr ? hero.descriptionAr : isFr ? (hero.descriptionFr || hero.descriptionAr) : (hero.descriptionEn || hero.descriptionAr)

  // Trilingual values for CTA
  const ctaTitle = isAr ? cta.titleAr : isFr ? (cta.titleFr || cta.titleAr) : (cta.titleEn || cta.titleAr)
  const ctaDesc = isAr ? cta.descAr : isFr ? (cta.descFr || cta.descAr) : (cta.descEn || cta.descAr)
  const ctaPrimaryText = isAr ? cta.primaryBtnTextAr : isFr ? (cta.primaryBtnTextFr || cta.primaryBtnTextAr) : (cta.primaryBtnTextEn || cta.primaryBtnTextAr)
  const ctaSecondaryText = isAr ? cta.secondaryBtnTextAr : isFr ? (cta.secondaryBtnTextFr || cta.secondaryBtnTextAr) : (cta.secondaryBtnTextEn || cta.secondaryBtnTextAr)

  let programs: ProgramDisplayItem[] = []

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('programs')
      .select('id, slug, category, city, cover_image, start_date, end_date, program_translations!inner(title, description, objectives, target_audience, activities)')
      .eq('status', 'published')
      .eq('program_translations.locale', locale)

    if (data && data.length > 0) {
      const rawList = data as unknown as RawProgramItem[]
      programs = rawList.map((p) => {
        const trans = p.program_translations?.[0] || { title: p.slug }
        return {
          id: p.id,
          slug: p.slug,
          category: p.category,
          city: p.city,
          cover_image: p.cover_image,
          start_date: p.start_date,
          end_date: p.end_date,
          title: trans.title,
          description: trans.description,
          objectives: trans.objectives,
          target_audience: trans.target_audience,
          activities: trans.activities,
        }
      })
    }
  } catch {
    // Graceful fallback during build
  }

  // Fallback initial programs if none in DB yet
  const defaultPrograms: ProgramDisplayItem[] = [
    {
      id: 'p-1',
      slug: 'youth-in-action',
      category: 'youth',
      city: isAr ? 'مختلف المدن المغربية' : isFr ? 'Plusieurs villes marocaines' : 'Various Moroccan Cities',
      cover_image: '/images/youth-in-action.jpg',
      title: isAr ? 'مبادرة شباب في العمل (Youth in Action)' : isFr ? 'Initiative Jeunesse en Action (Youth in Action)' : 'Youth in Action Initiative',
      description: isAr
        ? 'البرنامج التطوعي الرائد للجمعية الهادف إلى إدماج الشباب في الحياة الثقافية وتأطيرهم لقيادة المبادرات الإبداعية والمجتمعية بروح المواطنة الفاعلة.'
        : isFr
        ? 'Programme bénévole phare de l\'AMYCC engageant les jeunes dans la vie culturelle et le leadership associatif.'
        : 'Flagship volunteering initiative empowering youth to co-create and lead cultural and community projects.',
      objectives: isAr ? 'تأهيل 200 شاب سنوياً، تنمية مهارات القيادة المدنية، وتعزيز التضامن الثقافي' : isFr ? 'Formation de 200 jeunes par an, développement du leadership civique et renforcement de la solidarité culturelle.' : 'Skill building, cultural leadership, civic solidarity.',
      target_audience: isAr ? 'الشباب والطلبة من 16 إلى 30 سنة من مختلف جهات المملكة' : isFr ? 'Jeunes et étudiants de 16 à 30 ans à travers le Royaume' : 'Youth & students aged 16–30 across Morocco',
      activities: isAr ? 'ورشات تدريبية، مخيمات تطوعية، تنظيم مهرجانات ومعارض فنية' : isFr ? 'Ateliers de formation, chantiers bénévoles, festivals et expositions artistiques' : 'Training workshops, volunteer camps, artistic events',
    },
    {
      id: 'p-2',
      slug: 'arts-heritage-workshops',
      category: 'arts',
      city: isAr ? 'المملكة المغربية' : isFr ? 'Royaume du Maroc' : 'Morocco',
      cover_image: '/images/hero-art.jpg',
      title: isAr ? 'ورشات الفنون والتراث الإبداعي' : isFr ? 'Ateliers des Arts et du Patrimoine' : 'Arts & Creative Heritage Workshops',
      description: isAr
        ? 'سلسلة محترفات متخصصة في الفنون التشكيلية، الرسم، الخزف، والخط العربي لاستكشاف وتثمين الموروث الجمالي المغربي العريق.'
        : isFr
        ? 'Série d\'ateliers spécialisés en arts plastiques et calligraphie explorant le patrimoine visuel marocain.'
        : 'Specialized masterclasses in visual arts, calligraphy, and ceramics exploring the rich Moroccan visual heritage.',
      objectives: isAr ? 'صقل المواهب التشكيلية، إنتاج معارض جماعية، وتوثيق التقنيات الفنية التقليدية' : isFr ? 'Développement des talents plastiques, expositions collectives et valorisation des techniques traditionnelles' : 'Talent development, group exhibitions, technique mastery.',
      target_audience: isAr ? 'الهواة والمبدعون الصاعدون وشباب الجمعيات الثقافية' : isFr ? 'Créateurs émergents, passionnés d’art et jeunesse associative' : 'Emerging artists & creators',
      activities: isAr ? 'محترفات الصباغة المائية والزيتية، دورات الخط المغربي، إقامات إبداعية' : isFr ? 'Ateliers de peinture à l’huile et aquarelle, calligraphie marocaine, résidences créatives' : 'Painting workshops, calligraphy courses, creative residencies',
    },
    {
      id: 'p-3',
      slug: 'theatre-scenic-expression',
      category: 'theatre',
      city: isAr ? 'مراكش والجهات' : isFr ? 'Marrakech & Régions' : 'Marrakech & Regions',
      title: isAr ? 'برنامج المسرح وفنون الأداء التعبيري' : isFr ? 'Programme Théâtre & Arts de la Scène' : 'Theatre & Performing Arts Program',
      description: isAr
        ? 'تكوين مسرحي شامل يغطي فن الحكاية (الحلقة)، الإلقاء الصوتي، التعبير الحركي، وكتابة النصوص الدرامية الملتزمة بالقضايا المجتمعية.'
        : isFr
        ? 'Formation théâtrale couvrant le conte, la diction, le jeu corporel et l\'écriture dramatique.'
        : 'Comprehensive stage training covering storytelling, voice control, dramatic writing, and stage presence.',
      objectives: isAr ? 'إنتاج عروض مسرحية شبابية والمشاركة في المهرجانات الوطنية والدولية' : isFr ? 'Production de spectacles théâtraux de jeunes et participation aux festivals nationaux et internationaux' : 'Stage play productions and participation in youth festivals.',
      target_audience: isAr ? 'هواة المسرح والشباب المهتم بالتمثيل والإخراج' : isFr ? 'Passionnés de théâtre, jeunes comédiens et acteurs en herbe' : 'Theatre enthusiasts & performers',
      activities: isAr ? 'تمارين الارتجال، تدريبات الصوت والجسد، إعداد عروض مسرح الشارع' : isFr ? 'Exercices d’improvisation, travail de la voix et du corps, spectacles de théâtre de rue' : 'Improvisation exercises, voice training, street theatre',
    },
    {
      id: 'p-4',
      slug: 'musical-heritage-revival',
      category: 'music',
      city: isAr ? 'المملكة المغربية' : isFr ? 'Royaume du Maroc' : 'Morocco',
      title: isAr ? 'مختبر إحياء التراث الموسيقي المغربي' : isFr ? 'Laboratoire du Patrimoine Musical Marocain' : 'Moroccan Musical Heritage Lab',
      description: isAr
        ? 'ورشات تدريبية للتعريف بالآلات والمقامات والإيقاعات التراثية المغربية وتوثيق الأهازيج التقليدية ونقلها للأجيال الصاعدة.'
        : isFr
        ? 'Ateliers de pratique instrumentale traditionnelle et de documentation des rythmes du terroir marocain.'
        : 'Instrumental masterclasses focusing on traditional Moroccan scales, rhythms, and folkloric melodies.',
      objectives: isAr ? 'صون التراث الشفهي الموسيقي، تدريب العازفين الشباب، وتوثيق الأنغام الأصيلة' : isFr ? 'Sauvegarde du patrimoine musical oral, formation des jeunes instrumentistes et valorisation des mélodies authentiques' : 'Oral music heritage preservation & youth music training.',
      target_audience: isAr ? 'الموسيقيون الشباب، الباحثون في التراث، والمهتمون بالنغم المغربي' : isFr ? 'Jeunes musiciens, chercheurs en patrimoine et passionnés de musique marocaine' : 'Young musicians & heritage lovers',
      activities: isAr ? 'دروس العزف على العود والوتريات، تسجيلات صوتية ميدانية، ندوات تراثية' : isFr ? 'Cours de luth (oud) et instruments à cordes, enregistrements sonores de terrain, conférences musicales' : 'Oud lessons, field audio recordings, heritage talks',
    },
  ]

  const displayPrograms = programs.length > 0 ? programs : defaultPrograms

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#F5F3EE]">
        {/* ============================================================
            1. HERO BANNER (Full-Bleed Moroccan Cinematic Hero or Ambient Pattern)
            ============================================================ */}
        <section
          className={`relative overflow-hidden border-b transition-colors ${
            hasHeroImage
              ? 'min-h-[500px] sm:min-h-[540px] lg:min-h-[600px] flex items-center bg-[#231f20] text-white pt-16 pb-24 lg:pt-20 lg:pb-32 border-[#231f20]'
              : 'bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-[#e5e0d6] pt-16 pb-20 lg:pt-20 lg:pb-28 text-[#231f20]'
          }`}
        >
          {/* Background Layer */}
          {hasHeroImage ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <ImageWithFallback
                src={hero.imageUrl!}
                fallbackSrc="/images/youth-in-action.jpg"
                alt="AMYCC Programs Hero Banner"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Cinematic Moroccan Vignette & Dark Backdrops for perfect high-contrast typography and clear visual */}
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/90 via-[#231f20]/65 to-[#231f20]/95" />
              <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
              <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#ffd22f]/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#231f20]/10 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center w-full">
            {/* Breadcrumb Navigation */}
            <nav
              className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-bold ${
                hasHeroImage ? 'text-white/80' : 'text-[#5C5A55]'
              }`}
            >
              <Link
                href={`/${locale}`}
                className={`transition-colors ${hasHeroImage ? 'hover:text-white' : 'hover:text-[#231f20]'}`}
              >
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <span className={hasHeroImage ? 'text-[#ffd22f]' : 'text-[#bd3227]'}>
                {isAr ? 'البرامج والمشاريع الثقافية' : isFr ? 'Programmes' : 'Programs'}
              </span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {heroTag && (
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-md ${
                    hasHeroImage
                      ? 'bg-white/10 border border-white/20 text-[#ffd22f]'
                      : 'bg-[#bd3227]/10 border border-[#bd3227]/20 text-[#bd3227]'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${hasHeroImage ? 'bg-[#ffd22f]' : 'bg-[#bd3227]'} animate-pulse`}
                  />
                  <span>{heroTag}</span>
                </span>
              )}

              {heroBadge && (
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-md ${
                    hasHeroImage
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'bg-[#231f20]/10 border border-[#231f20]/20 text-[#231f20]'
                  }`}
                >
                  <span>🇲🇦</span>
                  <span>{heroBadge}</span>
                </span>
              )}
            </div>

            {/* Headline Title */}
            <h1
              className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight whitespace-pre-line ${
                hasHeroImage ? 'text-white drop-shadow-md' : 'text-[#231f20]'
              }`}
            >
              {heroTitle}
            </h1>

            {/* Description */}
            <p
              className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-balance ${
                hasHeroImage ? 'text-[#FEF6CC]/95 font-normal drop-shadow-xs' : 'text-[#5C5A55] font-medium'
              }`}
            >
              {heroDesc}
            </p>
          </div>
        </section>

        {/* ============================================================
            2. IMPACT STATS RIBBON (CMS DRIVEN)
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {stats.map((st) => {
              const label = isAr ? st.labelAr : isFr ? (st.labelFr || st.labelAr) : (st.labelEn || st.labelAr)
              return (
                <div
                  key={st.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#231f20]/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-center items-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-2xl mb-2.5 group-hover:scale-110 transition-transform">
                    {st.icon}
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-[#231f20] tracking-tight block">
                    {st.value}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#5C5A55] mt-1 leading-snug">
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* ============================================================
            3. FEATURED SPOTLIGHT: FLAGSHIP VOLUNTEER INITIATIVE
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="relative rounded-3xl overflow-hidden border border-[#e5e0d6] bg-gradient-to-br from-[#231f20] via-[#231f20] to-[#d2a82b] text-white p-8 sm:p-12 shadow-card">
            <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
            <div className="absolute top-0 end-0 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ffd22f] text-[#231f20] shadow-xs">
                  <span>★</span>
                  <span>{isAr ? 'المبادرة الرائدة المستمرة للجمعية' : isFr ? 'Initiative Phare Continue de l\'AMYCC' : 'Flagship Continuous Initiative'}</span>
                </span>

                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {isAr ? 'مبادرة شباب في العمل (Youth in Action)' : isFr ? 'Initiative Jeunesse en Action (Youth in Action)' : 'Youth in Action Initiative'}
                </h2>

                <p className="text-sm sm:text-base text-[#FEF6CC]/90 leading-relaxed max-w-2xl">
                  {isAr
                    ? 'المحرك التطوعي والتأطيري الأساسي لجمعية روح الفنون والثقافة، الذي يفتح آفاقاً واسعة أمام الشباب المغربي للمشاركة في تدبير الفعاليات الثقافية، قيادة الورشات الميدانية، وتطوير المهارات الحياتية.'
                    : isFr
                    ? 'Le cadre bénévole et citoyen phare de l\'AMYCC, offrant aux jeunes marocains l\'opportunité de participer à l\'animation culturelle, d\'animer des ateliers de terrain et de développer leurs compétences civiques et artistiques.'
                    : 'The premier youth-led volunteering framework at AMYCC, empowering active civic engagement and cultural leadership.'}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/${locale}/programs/youth-in-action`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs sm:text-sm text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f] active:scale-98 transition-all shadow-md"
                  >
                    <span>{isAr ? 'استكشف مسار المبادرة بالتفصيل' : isFr ? 'Découvrir l\'initiative en détail' : 'Explore Initiative Details'}</span>
                    <span className="rtl:rotate-180">→</span>
                  </Link>

                  <Link
                    href={`/${locale}/membership`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
                  >
                    <span>{isAr ? 'انضم وتطوع معنا' : isFr ? 'Devenir bénévole avec nous' : 'Volunteer With Us'}</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-center space-y-3 w-full max-w-xs">
                  <span className="text-4xl sm:text-5xl block">🤝</span>
                  <h4 className="font-bold text-sm sm:text-base text-[#ffd22f]">
                    {isAr ? 'تأطير مجتمعي وتضامني' : isFr ? 'Mentorat Civique & Solidaire' : 'Civic Mentorship'}
                  </h4>
                  <p className="text-xs text-[#FEF6CC]/80 leading-relaxed">
                    {isAr
                      ? 'مواكبة دورية ومشاريع ميدانية لخدمة الثقافة والشباب بالمملكة المغربية.'
                      : isFr
                      ? 'Accompagnement continu et actions de terrain au service de la jeunesse et de la création culturelle au Maroc.'
                      : 'Structured cultural mentoring and fieldwork across Moroccan regions.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            4. INTERACTIVE PROGRAMS CATALOG & SEARCH DIRECTORY
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ProgramsCatalog
            programs={displayPrograms}
            locale={locale}
            dict={dict}
          />
        </section>

        {/* ============================================================
            5. INSTITUTIONAL CALL TO ACTION BANNER (CMS DRIVEN)
            ============================================================ */}
        <section className="bg-white border-t border-[#e5e0d6] py-16 lg:py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 moroccan-pattern-light opacity-30 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bd3227]">
              {isAr ? 'شراكات ومبادرات مشتركة • AMYCC' : isFr ? 'Partenariats & Co-Création • AMYCC' : 'AMYCC Partnership & Co-Creation'}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-[#231f20] tracking-tight">
              {ctaTitle}
            </h2>

            <p className="text-sm sm:text-base text-[#5C5A55] max-w-2xl mx-auto leading-relaxed">
              {ctaDesc}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}${cta.primaryBtnUrl || '/contact'}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-xs sm:text-sm text-white bg-[#231f20] hover:bg-[#231f20] active:scale-98 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>{ctaPrimaryText}</span>
                <span className="rtl:rotate-180">→</span>
              </Link>

              <Link
                href={`/${locale}${cta.secondaryBtnUrl || '/membership'}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#231f20] bg-[#F5F3EE] hover:bg-[#FEF6CC] border border-[#e5e0d6] transition-all cursor-pointer"
              >
                <span>{ctaSecondaryText}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}
