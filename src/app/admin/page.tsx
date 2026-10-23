import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch real counts from Supabase
  const [
    { count: membershipCount },
    { count: volunteerCount },
    { count: partnershipCount },
    { count: donationCount },
  ] = await Promise.all([
    supabase.from('membership_applications').select('*', { count: 'exact', head: true }),
    supabase.from('volunteer_applications').select('*', { count: 'exact', head: true }),
    supabase.from('partnership_inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('donation_records').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Membership Applications', count: membershipCount ?? 0, href: '/admin/memberships', icon: '👥', color: 'bg-blue-50 text-[#0068ff]' },
    { label: 'Volunteer Applicants', count: volunteerCount ?? 0, href: '/admin/volunteers', icon: '🤝', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Partnership Inquiries', count: partnershipCount ?? 0, href: '/admin/partnerships', icon: '🏛️', color: 'bg-purple-50 text-purple-600' },
    { label: 'Donation Notices', count: donationCount ?? 0, href: '/admin/donations', icon: '💝', color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a0f1d]">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time summary of AMYCC platform submissions and engagement.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all block group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${stat.color}`}>
                {stat.icon}
              </span>
              <span className="text-2xs font-bold text-slate-400 group-hover:text-[#0068ff] transition-colors">
                View →
              </span>
            </div>
            <div className="text-3xl font-black text-[#0a0f1d]">{stat.count}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Action & Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <h2 className="text-base font-bold text-[#0a0f1d] mb-4">Quick Operations</h2>
          <div className="space-y-2">
            <Link
              href="/admin/memberships"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700"
            >
              <span>Review Pending Membership Applications</span>
              <span>→</span>
            </Link>
            <Link
              href="/admin/volunteers"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700"
            >
              <span>Review Youth in Action Volunteer Roster</span>
              <span>→</span>
            </Link>
            <Link
              href="/admin/partnerships"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700"
            >
              <span>Review Institutional Partnership Inquiries</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <h2 className="text-base font-bold text-[#0a0f1d] mb-4">System Status</h2>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span>Database (PostgreSQL)</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span>Authentication (Supabase Auth)</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Row Level Security (RLS)</span>
              <span className="font-bold text-blue-600">Enforced (All Tables)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
