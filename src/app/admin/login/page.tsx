import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminLoginView } from '@/components/admin/AdminLoginView'

export default async function AdminLoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/admin')
  }

  return <AdminLoginView initialError={searchParams.error} />
}
