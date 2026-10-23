import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { deleteProgram } from '@/lib/actions/content'

interface ProgramTrans {
  locale: string
  title: string
}

interface ProgramRow {
  id: string
  slug: string
  category: string
  city?: string
  status: string
  program_translations?: ProgramTrans[]
}

export default async function AdminProgramsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: rawPrograms } = await supabase
    .from('programs')
    .select('*, program_translations(*)')
    .order('created_at', { ascending: false })

  const programs = (rawPrograms || []) as ProgramRow[]

  async function updateProgramStatus(id: string, newStatus: string) {
    'use server'
    const sb = await createClient()
    await sb.from('programs').update({ status: newStatus }).eq('id', id)
    revalidatePath('/admin/programs')
    revalidatePath('/ar/programs')
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteProgram(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08242a]">Programs Management</h1>
          <p className="text-xs text-[#5f7174] mt-1">
            Create, edit, and publish cultural and youth initiatives across Moroccan cities.
          </p>
        </div>
        <Link
          href="/admin/programs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d3b43] text-white text-xs font-bold rounded-xl hover:bg-[#14505b] active:scale-98 transition-all shadow-subtle hover:shadow-card"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Program
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#2d3b3e]">
            <thead className="bg-[#faf7f2] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5f7174] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Program Title (Translations)</th>
                <th className="px-6 py-4 text-start">Category / City</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede2]">
              {programs.length > 0 ? (
                programs.map((prog) => {
                  const arTitle =
                    prog.program_translations?.find((t) => t.locale === 'ar')?.title || prog.slug
                  const enTitle = prog.program_translations?.find((t) => t.locale === 'en')?.title
                  return (
                    <tr key={prog.id} className="hover:bg-[#faf7f2]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#08242a]">{arTitle}</div>
                        {enTitle && <div className="text-[#5f7174] text-2xs">{enTitle}</div>}
                        <div className="text-[#819598] text-3xs font-mono">/{prog.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold block capitalize text-[#0d3b43]">{prog.category}</span>
                        <span className="text-[#819598] text-3xs">{prog.city || 'National Scope'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                            prog.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {prog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/admin/programs/${prog.id}/edit`}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#faf7f2] text-[#08242a] hover:bg-[#f4ede2] border border-[#e5e0d6] transition-colors"
                          >
                            Edit
                          </Link>

                          {prog.status !== 'published' ? (
                            <form
                              action={updateProgramStatus.bind(null, prog.id, 'published')}
                              className="inline"
                            >
                              <button
                                type="submit"
                                className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              >
                                Publish
                              </button>
                            </form>
                          ) : (
                            <form
                              action={updateProgramStatus.bind(null, prog.id, 'draft')}
                              className="inline"
                            >
                              <button
                                type="submit"
                                className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                              >
                                Unpublish
                              </button>
                            </form>
                          )}

                          <form
                            action={handleDelete.bind(null, prog.id)}
                            className="inline"
                          >
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#819598]">
                    No programs yet.{' '}
                    <Link href="/admin/programs/new" className="text-[#c85a32] font-bold hover:underline">
                      Create the first one →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
