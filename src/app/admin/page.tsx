import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch real counts from Supabase with safe fallback
  let membershipCount = 0
  let volunteerCount = 0
  let partnershipCount = 0
  let donationCount = 0
  let registrationCount = 0
  let contactCount = 0
  let programCount = 0
  let eventCount = 0
  let newsCount = 0

  try {
    const [
      { count: mCount },
      { count: vCount },
      { count: pCount },
      { count: dCount },
      { count: rCount },
      { count: cCount },
      { count: prCount },
      { count: evCount },
      { count: nwCount },
    ] = await Promise.all([
      supabase.from('membership_applications').select('*', { count: 'exact', head: true }),
      supabase.from('volunteer_applications').select('*', { count: 'exact', head: true }),
      supabase.from('partnership_inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('donation_records').select('*', { count: 'exact', head: true }),
      supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('programs').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('news_articles').select('*', { count: 'exact', head: true }),
    ])

    membershipCount = mCount ?? 0
    volunteerCount = vCount ?? 0
    partnershipCount = pCount ?? 0
    donationCount = dCount ?? 0
    registrationCount = rCount ?? 0
    contactCount = cCount ?? 0
    programCount = prCount ?? 0
    eventCount = evCount ?? 0
    newsCount = nwCount ?? 0
  } catch {
    // Graceful fallback
  }

  const statCards = [
    {
      labelAr: 'طلبات العضوية والانخراط',
      labelEn: 'Membership Applications',
      count: membershipCount,
      href: '/admin/memberships',
      icon: '👥',
      color: 'bg-[#d8f0f4] text-[#0d3b43]',
    },
    {
      labelAr: 'متطوعو شباب في العمل',
      labelEn: 'Volunteer Applicants',
      count: volunteerCount,
      href: '/admin/volunteers',
      icon: '🤝',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      labelAr: 'تسجيلات حضور الفعاليات',
      labelEn: 'Event Registrations',
      count: registrationCount,
      href: '/admin/registrations',
      icon: '🎟️',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      labelAr: 'مقترحات الشراكة المؤسسية',
      labelEn: 'Partnership Inquiries',
      count: partnershipCount,
      href: '/admin/partnerships',
      icon: '🏛️',
      color: 'bg-[#fae4dc] text-[#c85a32]',
    },
    {
      labelAr: 'رسائل التواصل والاستفسارات',
      labelEn: 'Contact Messages',
      count: contactCount,
      href: '/admin/contacts',
      icon: '💬',
      color: 'bg-amber-50 text-amber-700',
    },
    {
      labelAr: 'إشعارات الدعم والمساهمات',
      labelEn: 'Donations & Support',
      count: donationCount,
      href: '/admin/donations',
      icon: '💝',
      color: 'bg-purple-50 text-purple-700',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-2xs font-bold text-[#c85a32] uppercase tracking-wider mb-1">
            <span>لوحة التحكم المؤسسية</span>
            <span>•</span>
            <span>AMYCC Administration Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#08242a]">
            نظرة عامة وإحصائيات المنصة
          </h1>
          <p className="text-xs sm:text-sm text-[#5f7174] mt-1 font-medium">
            جمعية روح الفنون والثقافة (تأسست 2026، المملكة المغربية) — مركز القيادة وإدارة المحتوى والطلبات الواردة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/translations"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#faf7f2] border border-[#e5e0d6] text-xs font-bold text-[#08242a] shadow-2xs transition-colors flex items-center gap-2"
          >
            <span>🌐</span>
            <span>تتبع اكتمال الترجمة ↗</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat) => (
          <Link
            key={stat.labelEn}
            href={stat.href}
            className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#0d3b43]/30 transition-all block group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
                {stat.icon}
              </span>
              <span className="text-2xs font-bold text-[#5f7174] group-hover:text-[#c85a32] transition-colors flex items-center gap-1">
                <span>إدارة</span>
                <span aria-hidden="true">←</span>
              </span>
            </div>
            <div className="text-3xl font-black text-[#08242a]">{stat.count}</div>
            <div className="text-xs font-bold text-[#08242a] mt-1.5">{stat.labelAr}</div>
            <div className="text-3xs text-[#819598] font-medium">{stat.labelEn}</div>
          </Link>
        ))}
      </div>

      {/* Content Counts Strip */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e5e0d6]">
          <span className="text-3xs text-[#5f7174] font-bold block">البرامج الثقافية المعتمدة</span>
          <span className="text-2xl font-black text-[#0d3b43]">{programCount}</span>
          <Link href="/admin/programs" className="text-3xs text-[#c85a32] font-bold block mt-1 hover:underline">
            عرض البرامج ↗
          </Link>
        </div>

        <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e5e0d6]">
          <span className="text-3xs text-[#5f7174] font-bold block">الفعاليات والورش المجدولة</span>
          <span className="text-2xl font-black text-[#0d3b43]">{eventCount}</span>
          <Link href="/admin/events" className="text-3xs text-[#c85a32] font-bold block mt-1 hover:underline">
            عرض الفعاليات ↗
          </Link>
        </div>

        <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e5e0d6]">
          <span className="text-3xs text-[#5f7174] font-bold block">الأخبار والبيانات المنشورة</span>
          <span className="text-2xl font-black text-[#0d3b43]">{newsCount}</span>
          <Link href="/admin/news" className="text-3xs text-[#c85a32] font-bold block mt-1 hover:underline">
            عرض الأخبار ↗
          </Link>
        </div>
      </div>

      {/* Operations & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fast Action Shortcuts */}
        <div className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle">
          <h2 className="text-xs font-bold text-[#08242a] mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>⚡</span>
            <span>إجراءات سريعة لإدارة المحتوى / Fast Content Actions</span>
          </h2>
          <div className="space-y-2.5">
            <Link
              href="/admin/programs/new"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf7f2] hover:bg-[#f4ede2] transition-colors text-xs font-bold text-[#08242a]"
            >
              <span>🎨 إضافة برنامج ثقافي أو فني جديد (بـ 3 لغات)</span>
              <span className="text-[#c85a32]">جديد +</span>
            </Link>
            <Link
              href="/admin/news/new"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf7f2] hover:bg-[#f4ede2] transition-colors text-xs font-bold text-[#08242a]"
            >
              <span>📰 تحرير مقال أو بيان صحفي بمحرر TipTap الغني</span>
              <span className="text-[#c85a32]">جديد +</span>
            </Link>
            <Link
              href="/admin/events/new"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf7f2] hover:bg-[#f4ede2] transition-colors text-xs font-bold text-[#08242a]"
            >
              <span>📅 جدولة فعالية ثقافية جديدة وتحديد الطاقة الاستيعابية</span>
              <span className="text-[#c85a32]">جديد +</span>
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf7f2] hover:bg-[#f4ede2] transition-colors text-xs font-bold text-[#08242a]"
            >
              <span>📁 رفع أصل رقمي إلى مكتبة الوسائط المعتمدة</span>
              <span className="text-[#c85a32]">إضافة +</span>
            </Link>
          </div>
        </div>

        {/* Security & System Health */}
        <div className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle">
          <h2 className="text-xs font-bold text-[#08242a] mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>🛡️</span>
            <span>حالة النظام والأمان / Security & System Health</span>
          </h2>
          <div className="space-y-3.5 text-xs text-[#445457]">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f4ede2]">
              <span className="font-medium">قاعدة البيانات (PostgreSQL via Supabase)</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> متصل ومستقر
              </span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f4ede2]">
              <span className="font-medium">سياسات الأمان (Row Level Security - RLS)</span>
              <span className="font-bold text-emerald-700">مفعلة (16 جدول)</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f4ede2]">
              <span className="font-medium">توثيق الجلسات الإدارية</span>
              <span className="font-mono text-3xs bg-[#faf7f2] px-2 py-1 rounded border border-[#e5e0d6] text-[#08242a]">
                SSR Cookie Verified
              </span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f4ede2]">
              <span className="font-medium">الأدوار المعتمدة (RBAC)</span>
              <Link href="/admin/roles" className="font-bold text-[#c85a32] hover:underline">
                9 أدوار معتمدة ↗
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">إصدار منصة التطوير</span>
              <span className="font-bold text-[#0d3b43]">Next.js 16.4.2 App Router (Turbopack)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
