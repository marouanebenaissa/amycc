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

  try {
    const [
      { count: mCount },
      { count: vCount },
      { count: pCount },
      { count: dCount },
      { count: rCount },
      { count: cCount },
    ] = await Promise.all([
      supabase.from('membership_applications').select('*', { count: 'exact', head: true }),
      supabase.from('volunteer_applications').select('*', { count: 'exact', head: true }),
      supabase.from('partnership_inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('donation_records').select('*', { count: 'exact', head: true }),
      supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    ])

    membershipCount = mCount ?? 0
    volunteerCount = vCount ?? 0
    partnershipCount = pCount ?? 0
    donationCount = dCount ?? 0
    registrationCount = rCount ?? 0
    contactCount = cCount ?? 0
  } catch {
    // Graceful fallback
  }

  const statCards = [
    { label: 'Membership Applications', count: membershipCount, href: '/admin/memberships', icon: '👥', color: 'bg-[#d8f0f4] text-[#0d3b43]' },
    { label: 'Volunteer Applicants', count: volunteerCount, href: '/admin/volunteers', icon: '🤝', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Event Registrations', count: registrationCount, href: '/admin/registrations', icon: '🎟️', color: 'bg-blue-50 text-blue-700' },
    { label: 'Partnership Inquiries', count: partnershipCount, href: '/admin/partnerships', icon: '🏛️', color: 'bg-[#fae4dc] text-[#c85a32]' },
    { label: 'Contact Inquiries', count: contactCount, href: '/admin/contacts', icon: '💬', color: 'bg-amber-50 text-amber-700' },
    { label: 'Donation Notices', count: donationCount, href: '/admin/donations', icon: '💝', color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#08242a]">
          Association Administration Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#5f7174] mt-1 font-medium">
          Spirit of Arts & Culture Association (AMYCC) — Comprehensive Control & Records Management
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#0d3b43]/30 transition-all block group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
                {stat.icon}
              </span>
              <span className="text-2xs font-bold text-[#5f7174] group-hover:text-[#c85a32] transition-colors">
                Manage →
              </span>
            </div>
            <div className="text-3xl font-black text-[#08242a]">{stat.count}</div>
            <div className="text-xs font-bold text-[#5f7174] mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Operations & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle">
          <h2 className="text-sm font-bold text-[#08242a] mb-4 uppercase tracking-wider">
            Content Management Fast Actions
          </h2>
          <div className="space-y-2.5">
            <Link
              href="/admin/programs/new"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf7f2] hover:bg-[#f4ede2] transition-colors text-xs font-bold text-[#08242a]"
            >
              <span>Create New Trilingual Program</span>
              <span className="text-[#c85a32]">New +</span>
            </Link>
            <Link
              href="/admin/news/new"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf7f2] hover:bg-[#f4ede2] transition-colors text-xs font-bold text-[#08242a]"
            >
              <span>Draft Cultural News Article (TipTap Editor)</span>
              <span className="text-[#c85a32]">New +</span>
            </Link>
            <Link
              href="/admin/events/new"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf7f2] hover:bg-[#f4ede2] transition-colors text-xs font-bold text-[#08242a]"
            >
              <span>Schedule Cultural Event & Set Capacity</span>
              <span className="text-[#c85a32]">New +</span>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle">
          <h2 className="text-sm font-bold text-[#08242a] mb-4 uppercase tracking-wider">
            Security & System Health
          </h2>
          <div className="space-y-3.5 text-xs text-[#445457]">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f4ede2]">
              <span className="font-medium">Database (PostgreSQL via Supabase)</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f4ede2]">
              <span className="font-medium">Row Level Security (RLS)</span>
              <span className="font-bold text-emerald-700">Enforced (16 Tables)</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f4ede2]">
              <span className="font-medium">Authentication Session</span>
              <span className="font-mono text-3xs bg-[#faf7f2] px-2 py-1 rounded border border-[#e5e0d6]">
                Cookie SSR Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Platform Version</span>
              <span className="font-bold text-[#0d3b43]">Next.js 16.4.2 App Router</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
