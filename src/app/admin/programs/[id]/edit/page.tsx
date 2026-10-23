import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ProgramForm } from '@/components/admin/ProgramForm'

export default async function EditProgramPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: program } = await supabase
    .from('programs')
    .select('*, program_translations(*)')
    .eq('id', id)
    .single()

  if (!program) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/programs"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="Back to Programs"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a0f1d]">Edit Program</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update program information and trilingual content.
          </p>
        </div>
      </div>

      <ProgramForm program={program} />
    </div>
  )
}
