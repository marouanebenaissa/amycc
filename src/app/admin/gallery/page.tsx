import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Image from 'next/image'

interface GalleryItem {
  id: string
  title: string
  description?: string | null
  image_url: string
  category: string
  status: string
  created_at: string
}

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  let items: GalleryItem[] = []

  try {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) items = data as GalleryItem[]
  } catch {
    // Migration fallback
  }

  async function handleCreate(formData: FormData) {
    'use server'
    const sb = await createClient()
    const title = formData.get('title') as string
    const imageUrl = formData.get('image_url') as string
    const category = formData.get('category') as string
    const description = (formData.get('description') as string) || null

    if (!title || !imageUrl) return

    await sb.from('gallery_items').insert({
      title,
      image_url: imageUrl,
      category,
      description,
      status: 'published',
    })

    revalidatePath('/admin/gallery')
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    'use server'
    const sb = await createClient()
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published'
    await sb.from('gallery_items').update({ status: nextStatus }).eq('id', id)
    revalidatePath('/admin/gallery')
  }

  async function handleDelete(id: string) {
    'use server'
    const sb = await createClient()
    await sb.from('gallery_items').delete().eq('id', id)
    revalidatePath('/admin/gallery')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#08242a]">Gallery & Media Management</h1>
        <p className="text-xs text-[#5f7174] mt-1">
          Upload and organize approved cultural activity photos, event recordings, and creative workshops.
        </p>
      </div>

      {/* Add Media Card */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-[#08242a] mb-4 uppercase tracking-wider">
          Add New Media Asset
        </h2>
        <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-2xs font-bold text-[#445457] mb-1">Title *</label>
            <input
              name="title"
              required
              placeholder="e.g. Theatre Workshop Casablanca"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
            />
          </div>
          <div>
            <label className="block text-2xs font-bold text-[#445457] mb-1">Image URL *</label>
            <input
              name="image_url"
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
            />
          </div>
          <div>
            <label className="block text-2xs font-bold text-[#445457] mb-1">Category</label>
            <select
              name="category"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none focus:border-[#0d3b43]"
            >
              <option value="events">Cultural Events</option>
              <option value="workshops">Artistic Workshops</option>
              <option value="youth">Youth in Action</option>
              <option value="theatre">Theatre & Music</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-colors shadow-xs"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-[#08242a] mb-4 uppercase tracking-wider">
          Approved Media Assets ({items.length})
        </h2>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#e5e0d6] overflow-hidden bg-[#faf7f2] flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-[#e5e0d6]">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute top-2 start-2 px-2 py-0.5 rounded text-3xs font-bold bg-[#08242a]/80 text-white capitalize">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-xs text-[#08242a] truncate">{item.title}</h3>
                  <div className="flex items-center justify-between pt-2 border-t border-[#e5e0d6]">
                    <form action={handleToggleStatus.bind(null, item.id, item.status)}>
                      <button
                        type="submit"
                        className={`text-3xs font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </button>
                    </form>
                    <form action={handleDelete.bind(null, item.id)}>
                      <button
                        type="submit"
                        className="text-3xs font-bold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[#819598] text-xs">
            No media assets added yet. Use the form above to add your first cultural photograph.
          </div>
        )}
      </div>
    </div>
  )
}
