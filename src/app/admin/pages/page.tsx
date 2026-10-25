import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { savePageConfiguration } from '@/lib/actions/admin'

interface PageDefinition {
  key: string
  titleAr: string
  titleFr: string
  titleEn: string
  path: string
  icon: string
  category: string
  descriptionAr: string
}

const sitePages: PageDefinition[] = [
  {
    key: 'home',
    titleAr: 'الصفحة الرئيسية',
    titleFr: 'Page d\'Accueil',
    titleEn: 'Home Page',
    path: '',
    icon: '🏠',
    category: 'رئيسي',
    descriptionAr: 'واجهة المنصة، استعراض الهوية المؤسسية، البرامج المميزة، أحدث الفعاليات، ومبادرة شباب في العمل.',
  },
  {
    key: 'about',
    titleAr: 'عن الجمعية',
    titleFr: 'À Propos',
    titleEn: 'About AMYCC',
    path: 'about',
    icon: '🏛️',
    category: 'مؤسسي',
    descriptionAr: 'تاريخ التأسيس 2026، الرسالة، الرؤية، القيم، ومجالات النشاط الفني والشبابي في المغرب.',
  },
  {
    key: 'team',
    titleAr: 'فريق العمل والهيكلة',
    titleFr: 'Notre Équipe & Direction',
    titleEn: 'Team & Structure',
    path: 'team',
    icon: '👥',
    category: 'مؤسسي',
    descriptionAr: 'المكتب التنفيذي، اللجان الوظيفية، إضافة وتعديل الأعضاء ورفع صورهم الرسمية.',
  },
  {
    key: 'programs',
    titleAr: 'البرامج الثقافية والفنية',
    titleFr: 'Nos Programmes',
    titleEn: 'Cultural Programs',
    path: 'programs',
    icon: '🎨',
    category: 'أنشطة',
    descriptionAr: 'دليل المبادرات الفنية المستمرة وورش العمل والتطوير الإبداعي في المدن المغربية.',
  },
  {
    key: 'annual-program',
    titleAr: 'البرنامج الثقافي السنوي',
    titleFr: 'Programme Culturel Annuel',
    titleEn: 'Annual Cultural Program',
    path: 'annual-program',
    icon: '🗓️',
    category: 'أنشطة',
    descriptionAr: 'الأجندة السنوية الرباعية، الفصول الأربعة، المحاور الاستراتيجية ومؤشرات الإنجاز، مع تحميل الدليل الرسمي.',
  },
  {
    key: 'events',
    titleAr: 'أجندة الفعاليات',
    titleFr: 'Événements',
    titleEn: 'Events Agenda',
    path: 'events',
    icon: '📅',
    category: 'أنشطة',
    descriptionAr: 'العروض المسرحية، الأمسيات الثقافية، الورش الفنية، مع نظام التسجيل المباشر وتتبع المقاعد.',
  },
  {
    key: 'news',
    titleAr: 'الأخبار والبيانات الصحفية',
    titleFr: 'Actualités & Presse',
    titleEn: 'News & Press',
    path: 'news',
    icon: '📰',
    category: 'إعلام',
    descriptionAr: 'التغطيات الإعلامية، البيانات الرسمية، وبلاغات الجمعية للرأي العام والمؤسسات الشريكة.',
  },
  {
    key: 'membership',
    titleAr: 'الانخراط والعضوية',
    titleFr: 'Adhésion',
    titleEn: 'Membership',
    path: 'membership',
    icon: '👥',
    category: 'مشاركة',
    descriptionAr: 'استمارة الانخراط السنوي لأعضاء الجمعية والمبدعين والمهتمين بالثقافة والفنون.',
  },
  {
    key: 'volunteer',
    titleAr: 'التطوع — شباب في العمل',
    titleFr: 'Bénévolat — Jeunesse en Action',
    titleEn: 'Volunteering — Youth in Action',
    path: 'volunteer',
    icon: '🤝',
    category: 'مشاركة',
    descriptionAr: 'استمارة استقطاب الشباب المتطوع لمواكبة الفعاليات والتنشيط الثقافي والمجتمعي.',
  },
  {
    key: 'partnerships',
    titleAr: 'الشراكات والرعاية',
    titleFr: 'Partenariats',
    titleEn: 'Partnerships',
    path: 'partnerships',
    icon: '🤝',
    category: 'مؤسسي',
    descriptionAr: 'بوابة التعاون مع المؤسسات الثقافية، الشركات، والمنظمات الوطنية والدولية.',
  },
  {
    key: 'support',
    titleAr: 'الدعم والمساهمة',
    titleFr: 'Soutien & Dons',
    titleEn: 'Support & Donations',
    path: 'support',
    icon: '💝',
    category: 'مؤسسي',
    descriptionAr: 'إشعارات الدعم المالي والمساهمات العينية لدعم المشاريع والأنشطة الثقافية غير الربحية.',
  },
  {
    key: 'gallery',
    titleAr: 'معرض الصور والوسائط',
    titleFr: 'Galerie Médias',
    titleEn: 'Media Gallery',
    path: 'gallery',
    icon: '🖼️',
    category: 'إعلام',
    descriptionAr: 'التوثيق البصري للأنشطة والورش والعروض الفنية التي تنظمها الجمعية.',
  },
  {
    key: 'contact',
    titleAr: 'اتصل بنا',
    titleFr: 'Contact',
    titleEn: 'Contact Us',
    path: 'contact',
    icon: '💬',
    category: 'تواصل',
    descriptionAr: 'قنوات التواصل المؤسسي، نموذج المراسلة المباشر، وأرقام وعناوين الجمعية المعتمدة.',
  },
  {
    key: 'faq',
    titleAr: 'الأسئلة الشائعة',
    titleFr: 'Foire Aux Questions',
    titleEn: 'FAQ',
    path: 'faq',
    icon: '❓',
    category: 'تواصل',
    descriptionAr: 'إجابات عن الاستفسارات الأكثر تكراراً حول الانخراط، الفعاليات، ومبادرات الجمعية.',
  },
  {
    key: 'privacy',
    titleAr: 'سياسة الخصوصية والشروط',
    titleFr: 'Confidentialité & Mentions',
    titleEn: 'Privacy & Legal Terms',
    path: 'privacy',
    icon: '⚖️',
    category: 'قانوني',
    descriptionAr: 'حماية المعطيات ذات الطابع الشخصي (قانون 09-08 بالمغرب) والشروط القانونية للاستخدام.',
  },
]

export default async function AdminPagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch page settings if stored
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .like('key', 'page_%')

  const pageConfigs: Record<string, Record<string, unknown>> = {}
  if (settings) {
    settings.forEach((s) => {
      pageConfigs[s.key.replace('page_', '')] = (s.value as Record<string, unknown>) || {}
    })
  }

  async function handleUpdatePage(formData: FormData) {
    'use server'
    const pageKey = formData.get('pageKey') as string
    const status = formData.get('status') as string
    const seoTitleAr = formData.get('seoTitleAr') as string
    const seoDescAr = formData.get('seoDescAr') as string

    await savePageConfiguration(pageKey, {
      status,
      seoTitleAr,
      seoDescAr,
      updated_at: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-2xs font-bold text-[#c85a32] uppercase tracking-wider mb-1">
            <span>إدارة المحتوى</span>
            <span>•</span>
            <span>Content Management</span>
          </div>
          <h1 className="text-2xl font-black text-[#08242a]">
            صفحات وأقسام الموقع المؤسسي
          </h1>
          <p className="text-xs text-[#5f7174] mt-1 max-w-2xl">
            إدارة كافة صفحات المنصة، ضبط العناوين التعريفية، حالة النشر، ومعاينة الروابط باللغات الثلاث (العربية، الفرنسية، الإنجليزية).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#08242a] shadow-2xs">
            إجمالي الصفحات: {sitePages.length}
          </span>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sitePages.map((page) => {
          const config = pageConfigs[page.key] || {}
          const isPublished = (config.status as string) !== 'draft'

          return (
            <div
              key={page.key}
              className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-[#faf7f2] border border-[#e5e0d6]">
                      {page.icon}
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-[#08242a]">
                        {page.titleAr}
                      </h2>
                      <div className="text-3xs text-[#74bfcd] font-semibold">
                        {page.titleFr} • {page.titleEn}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-3xs font-bold ${
                      isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isPublished ? 'منشورة / Active' : 'مسودة / Draft'}
                  </span>
                </div>

                <p className="text-xs text-[#5f7174] leading-relaxed mb-4">
                  {page.descriptionAr}
                </p>

                {page.key === 'home' && (
                  <div className="mb-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-2">
                    <span className="text-3xs font-bold text-emerald-900">
                      🎯 إدارة مجالات التدخل الستة ومحتوى النوافذ المنبثقة
                    </span>
                    <Link
                      href="/admin/areas"
                      className="px-2.5 py-1 rounded-lg text-3xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-colors shrink-0"
                    >
                      إدارة مجالات التدخل →
                    </Link>
                  </div>
                )}

                {page.key === 'annual-program' && (
                  <div className="mb-3 p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between gap-2">
                    <span className="text-3xs font-bold text-teal-900">
                      🗓️ إدارة فصول ومحاور وأنشطة البرنامج السنوي بالكامل
                    </span>
                    <Link
                      href="/admin/annual-program"
                      className="px-2.5 py-1 rounded-lg text-3xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-colors shrink-0"
                    >
                      إدارة البرنامج السنوي →
                    </Link>
                  </div>
                )}

                {page.key === 'programs' && (
                  <div className="mb-3 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between gap-2">
                    <span className="text-3xs font-bold text-indigo-900">
                      🎨 إدارة كتالوج البرامج وإعدادات رأس الصفحة
                    </span>
                    <Link
                      href="/admin/programs"
                      className="px-2.5 py-1 rounded-lg text-3xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-colors shrink-0"
                    >
                      إدارة البرامج →
                    </Link>
                  </div>
                )}

                {page.key === 'faq' && (
                  <div className="mb-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-2">
                    <span className="text-3xs font-bold text-amber-900">
                      💡 إدارة وتعديل بنك الأسئلة الشائعة بالكامل
                    </span>
                    <Link
                      href="/admin/faqs"
                      className="px-2.5 py-1 rounded-lg text-3xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-colors shrink-0"
                    >
                      إدارة الأسئلة (FAQ CMS) →
                    </Link>
                  </div>
                )}

                {/* SEO Form inline */}
                <form action={handleUpdatePage} className="pt-3 border-t border-[#f4ede2] space-y-3">
                  <input type="hidden" name="pageKey" value={page.key} />
                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      عنوان محركات البحث (SEO Title):
                    </label>
                    <input
                      type="text"
                      name="seoTitleAr"
                      defaultValue={(config.seoTitleAr as string) || page.titleAr}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <select
                      name="status"
                      defaultValue={isPublished ? 'published' : 'draft'}
                      className="px-2 py-1 rounded-lg border border-[#e5e0d6] text-xs bg-[#faf7f2] font-semibold text-[#08242a]"
                    >
                      <option value="published">منشور (Public)</option>
                      <option value="draft">مسودة (Hidden)</option>
                    </select>

                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg text-2xs font-bold bg-[#0d3b43] hover:bg-[#14505b] text-white transition-colors"
                    >
                      حفظ التعديلات
                    </button>
                  </div>
                </form>
              </div>

              {/* Language Previews */}
              <div className="pt-4 mt-4 border-t border-[#f4ede2] flex items-center justify-between text-2xs">
                <span className="text-[#819598] font-mono">/{page.path}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-3xs text-[#5f7174]">معاينة:</span>
                  <Link
                    href={`/ar/${page.path}`}
                    target="_blank"
                    className="px-2 py-0.5 rounded bg-[#faf7f2] hover:bg-[#0d3b43] hover:text-white text-[#08242a] border border-[#e5e0d6] font-bold transition-colors"
                  >
                    عربي ↗
                  </Link>
                  <Link
                    href={`/fr/${page.path}`}
                    target="_blank"
                    className="px-2 py-0.5 rounded bg-[#faf7f2] hover:bg-[#0d3b43] hover:text-white text-[#08242a] border border-[#e5e0d6] font-bold transition-colors"
                  >
                    FR ↗
                  </Link>
                  <Link
                    href={`/en/${page.path}`}
                    target="_blank"
                    className="px-2 py-0.5 rounded bg-[#faf7f2] hover:bg-[#0d3b43] hover:text-white text-[#08242a] border border-[#e5e0d6] font-bold transition-colors"
                  >
                    EN ↗
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
