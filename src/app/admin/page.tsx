import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboardOverview } from '@/components/admin/AdminDashboardOverview'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch staff user full name from profiles
  let userFullName: string | null = null
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
    userFullName = profile?.full_name ?? null
  } catch {
    // Graceful fallback
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
  let staffUsersCount = 1

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
      { count: stCount },
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
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
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
    staffUsersCount = Math.max(stCount ?? 1, 1)
  } catch {
    // Graceful fallback
  }

  return (
    <AdminDashboardOverview
      userName={userFullName || (user.user_metadata?.full_name as string) || null}
      userEmail={user.email || 'admin@amycc.org'}
      counts={{
        membershipCount,
        volunteerCount,
        partnershipCount,
        donationCount,
        registrationCount,
        contactCount,
        programCount,
        eventCount,
        newsCount,
        staffUsersCount,
      }}
    />
  )
}
