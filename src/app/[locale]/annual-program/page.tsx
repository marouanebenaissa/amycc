import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { IconWithFallback } from '@/components/ui/IconWithFallback'
import Link from 'next/link'

export default async function AnnualProgramPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const seasons = [
    {
      quarter: isAr ? 'الربع الأول' : isFr ? '1er Trimestre' : 'Quarter 1',
      period: isAr ? 'يناير — مارس 2026' : isFr ? 'Janvier — Mars 2026' : 'January — March 2026',
      badge: isAr ? 'المرحلة التأسيسية' : isFr ? 'Lancement' : 'Foundation Phase',
      color: 'border-[#0d3b43]',
      accentBg: 'bg-[#d8f0f4] text-[#0d3b43]',
      icon: '🌱',
      iconSrc: '/icons/season-q1.png',
      events: [
        {
          title: isAr ? 'الإطلاق الرسمي للمنصة والبرامج الثقافية' : isFr ? 'Lancement officiel de la plateforme et des programmes' : 'Official Launch of Platform & Programs',
          desc: isAr ? 'تدشين المنصة الرقمية وبدء استقبال طلبات الانخراط والتطوع بالمملكة المغربية.' : 'Inauguration of digital trilingual platform and opening membership drive.',
          category: isAr ? 'تأسيس وتسيير' : 'Organization',
        },
        {
          title: isAr ? 'انطلاق مبادرة "شباب في العمل" (Youth in Action)' : isFr ? 'Lancement de l\'initiative Jeunesse en Action' : 'Youth in Action Volunteering Kickoff',
          desc: isAr ? 'ورشات تدريبية للشباب المتطوع حول تنظيم وإدارة الفعاليات الثقافية والمجتمعية.' : 'Orientation masterclasses for youth volunteers in cultural event management.',
          category: isAr ? 'تطوع وتمكين' : 'Youth Leadership',
        },
        {
          title: isAr ? 'محترفات المسرح والأداء التعبيري (الدورة الأولى)' : isFr ? 'Ateliers de théâtre et d\'art dramatique (Session 1)' : 'Theatre & Dramatic Arts Lab (Session 1)',
          desc: isAr ? 'تدريب عملي على تقنيات الإلقاء والتعبير الجسدي والارتجال المسرحي.' : 'Practical workshops on dramatic improvisation and stage movement.',
          category: isAr ? 'مسرح وفنون العرض' : 'Theatre Arts',
        },
      ],
    },
    {
      quarter: isAr ? 'الربع الثاني' : isFr ? '2ème Trimestre' : 'Quarter 2',
      period: isAr ? 'أبريل — يونيو 2026' : isFr ? 'Avril — Juin 2026' : 'April — June 2026',
      badge: isAr ? 'ربيع الإبداع والتراث' : isFr ? 'Printemps Créatif' : 'Spring Creativity',
      color: 'border-[#c85a32]',
      accentBg: 'bg-[#fae4dc] text-[#c85a32]',
      icon: '🎨',
      iconSrc: '/icons/season-q2.png',
      events: [
        {
          title: isAr ? 'أمسيات التراث الموسيقي المغربي الأصيل' : isFr ? 'Soirées du Patrimoine Musical Marocain' : 'Moroccan Heritage Musical Evenings',
          desc: isAr ? 'حلقات عزف واستماع مخصصة للروافد الموسيقية المغربية بمشاركة مواهب صاعدة.' : 'Acoustic sessions celebrating traditional Moroccan musical diversity.',
          category: isAr ? 'موسيقى وتراث' : 'Music Heritage',
        },
        {
          title: isAr ? 'معرض الفنون التشكيلية والخط العربي للشباب' : isFr ? 'Exposition des Arts Plastiques et Calligraphie' : 'Youth Fine Arts & Calligraphy Exhibition',
          desc: isAr ? 'معرض تفاعلي وورشات حية تبرز الموتيفات الهندسية والتراثية برؤية معاصرة.' : 'Showcase of emerging painters exploring Moroccan motifs and contemporary aesthetics.',
          category: isAr ? 'فنون بصرية' : 'Visual Arts',
        },
        {
          title: isAr ? 'الملتقى التشاركي للمجتمع المدني الثقافي' : isFr ? 'Rencontre participative des acteurs culturels' : 'Civic Cultural Actors Forum',
          desc: isAr ? 'جلسات تشاورية مع المراكز الثقافية والمؤسسات الشريكة لتعزيز التعاون.' : 'Collaborative roundtable with partner cultural centers and youth institutes.',
          category: isAr ? 'شراكات وتنسيق' : 'Partnerships',
        },
      ],
    },
    {
      quarter: isAr ? 'الربع الثالث' : isFr ? '3ème Trimestre' : 'Quarter 3',
      period: isAr ? 'يوليو — سبتمبر 2026' : isFr ? 'Juillet — Septembre 2026' : 'July — September 2026',
      badge: isAr ? 'الأنشطة الصيفية والتنشيط' : isFr ? 'Saison Estivale' : 'Summer Outreach',
      color: 'border-[#d99b26]',
      accentBg: 'bg-[#fdf2db] text-[#bd7d12]',
      icon: '☀️',
      iconSrc: '/icons/season-q3.png',
      events: [
        {
          title: isAr ? 'الجامعة الصيفية للإبداع والتمكين الشبابي' : isFr ? 'Université d\'Été de la Jeunesse Créative' : 'Summer School of Youth Creativity',
          desc: isAr ? 'محترفات مكثفة في الفنون المسرحية، التصوير الفوتوغرافي، والصوتيات.' : 'Intensive summer bootcamps in performing arts, sound design, and photography.',
          category: isAr ? 'تكوين مكثف' : 'Summer Training',
        },
        {
          title: isAr ? 'عروض مسرح الشارع والتنشيط الثقافي المفتوح' : isFr ? 'Spectacles de théâtre de rue et animation' : 'Open Air & Street Theatre Performances',
          desc: isAr ? 'عروض فنية في الفضاءات العامة ودور الشباب لتيسير الولوج الثقافي الحر.' : 'Free community performances in public squares and youth centers.',
          category: isAr ? 'ديمقراطية الثقافة' : 'Community Arts',
        },
        {
          title: isAr ? 'حملة التطوع الثقافي التضامني' : isFr ? 'Campagne de solidarité culturelle' : 'Civic Solidarity Cultural Drive',
          desc: isAr ? 'أنشطة فنية تطوعية مشتركة لإشاعة البهجة وصقل مهارات الأطفال والشباب.' : 'Artistic outreach sessions designed to inspire children and youth.',
          category: isAr ? 'شباب في العمل' : 'Youth Outreach',
        },
      ],
    },
    {
      quarter: isAr ? 'الربع الرابع' : isFr ? '4ème Trimestre' : 'Quarter 4',
      period: isAr ? 'أكتوبر — ديسمبر 2026' : isFr ? 'Octobre — Décembre 2026' : 'October — December 2026',
      badge: isAr ? 'المهرجان والتقييم السنوي' : isFr ? 'Clôture & Bilan' : 'Annual Festival & Review',
      color: 'border-[#0d3b43]',
      accentBg: 'bg-[#d8f0f4] text-[#0d3b43]',
      icon: '🏆',
      iconSrc: '/icons/season-q4.png',
      events: [
        {
          title: isAr ? 'المهرجان الثقافي السنوي لجمعية روح الفنون والثقافة' : isFr ? 'Festival Annuel de l\'AMYCC' : 'AMYCC Annual Cultural Festival',
          desc: isAr ? 'تتويج مخرجات ورشات المسرح والموسيقى والفنون في احتفالية فنية شاملة.' : 'Grand finale showcasing all artistic outputs from theatre, music, and painting masterclasses.',
          category: isAr ? 'مهرجان سنوي' : 'Annual Festival',
        },
        {
          title: isAr ? 'الملتقى الوطني للمتطوعين وتوزيع شواهد التميز' : isFr ? 'Cérémonie de remise des attestations de bénévolat' : 'National Volunteer Awards Ceremony',
          desc: isAr ? 'الاحتفاء بالشباب المتطوعين وتكريم المساهمات الميدانية في مبادرة شباب في العمل.' : 'Honoring youth volunteers and awarding official certificates of civic engagement.',
          category: isAr ? 'تقدير وشواهد' : 'Recognition',
        },
        {
          title: isAr ? 'الجمع العام السنوي وعرض التقريرين الأدبي والمالي' : isFr ? 'Assemblée Générale Ordinaire & Bilans' : 'Annual General Assembly & Reports',
          desc: isAr ? 'عرض حصيلة الأنشطة والتدبير المالي بكل شفافية والمصادقة على برنامج 2027.' : 'Transparent reporting of moral and financial stewardship before the general assembly.',
          category: isAr ? 'تسيير وشفافية' : 'Transparency',
        },
      ],
    },
  ]

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC 2026 Agenda
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {isAr ? 'البرنامج السنوي للموسم الثقافي 2026' : isFr ? 'Programme Annuel 2026' : 'Annual Cultural Program 2026'}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium leading-relaxed">
              {isAr
                ? 'الأجندة السنوية للورشات الفنية، العروض المسرحية، الأمسيات الموسيقية، ومبادرات التطوع المدني بمختلف المدن المغربية.'
                : isFr
                ? 'Calendrier complet de nos ateliers artistiques, représentations théâtrales et actions de bénévolat culturel pour la saison 2026.'
                : 'Comprehensive annual calendar of cultural masterclasses, theatre performances, musical showcases, and youth civic engagement across Morocco.'}
            </p>
          </div>
        </section>

        {/* 4 Seasons Interactive Timeline */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {seasons.map((season, sIdx) => (
            <div
              key={sIdx}
              className={`luxury-card p-6 sm:p-10 bg-white border-2 ${season.color}/20 hover:border-${season.color} transition-all space-y-6`}
            >
              {/* Season Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f4ede2] gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs overflow-hidden">
                    <IconWithFallback
                      src={season.iconSrc}
                      fallbackEmoji={season.icon}
                      alt={season.quarter}
                      size={28}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-[#08242a]">
                        {season.quarter}
                      </h2>
                      <span className={`text-3xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${season.accentBg}`}>
                        {season.badge}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#5f7174]">
                      {season.period}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#819598] font-medium">
                  {isAr ? 'المملكة المغربية • مختلف الجهات' : 'Kingdom of Morocco • Nationwide'}
                </div>
              </div>

              {/* Event Highlights List for this Season */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {season.events.map((event, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex flex-col justify-between hover:border-[#cfc7b9] transition-colors"
                  >
                    <div>
                      <span className="inline-block text-4xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-[#e5e0d6] text-[#0d3b43] mb-3">
                        {event.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#08242a] mb-2 leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[#445457] leading-relaxed">
                        {event.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#e5e0d6]/70 flex items-center justify-between text-3xs">
                      <span className="text-[#819598] font-medium">AMYCC 2026</span>
                      <Link
                        href={`/${locale}/events`}
                        className="font-bold text-[#c85a32] hover:underline"
                      >
                        {dict.events.register} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Program Participation & Partnership Banner */}
        <section className="bg-white border-t border-[#e5e0d6] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#14505b] text-[#f4ce83] border border-[#268292]/40">
              {isAr ? 'المشاركة في الأنشطة والبرمجة' : 'Join our Annual Program'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
              {isAr ? 'هل ترغب في احتضان أو المشاركة في فعاليات هذا البرنامج؟' : 'Interested in Hosting or Participating in our 2026 Season?'}
            </h2>
            <p className="text-sm sm:text-base text-[#445457] max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? 'نرحب بمقترحات المراكز الثقافية ودور الشباب لاستضافة الورشات، كما نفتح باب التطوع والانخراط للجميع بدون شروط مسبقة.'
                : 'Cultural institutions, community venues, and volunteers are warmly welcomed to collaborate and bring these cultural initiatives to life.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`/${locale}/events`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-all text-xs shadow-xs"
              >
                {dict.events.view_all}
              </Link>
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-[#08242a] bg-[#f4ce83] hover:bg-[#fae0a5] transition-all text-xs shadow-subtle"
              >
                {dict.membership.apply}
              </Link>
              <Link
                href={`/${locale}/partnerships`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[#0d3b43] bg-white border border-[#cfc7b9] hover:bg-[#faf7f2] transition-all text-xs"
              >
                {dict.partnerships.title}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}
