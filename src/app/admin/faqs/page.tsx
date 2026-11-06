import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getFaqSettings, defaultFaqConfig } from '@/lib/settings'
import { FaqManager } from '@/components/admin/FaqManager'

export const dynamic = 'force-dynamic'

export default async function AdminFaqsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const faqConfig = await getFaqSettings()

  return (
    <FaqManager
      initialItems={faqConfig.items}
      defaultItems={defaultFaqConfig.items}
    />
  )
}
