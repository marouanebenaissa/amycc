import { createAdminClient } from '@/lib/supabase/admin'

export const defaultEventsData = [
  {
    slug: 'performing-arts-masterclass',
    status: 'published' as const,
    start_date: '2026-11-15T16:00:00Z',
    end_date: '2026-11-15T19:00:00Z',
    venue: 'المركز الثقافي',
    city: 'الرباط',
    capacity: 40,
    registration_open: true,
    cover_image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
    translations: [
      {
        locale: 'ar',
        title: 'ورشة المسرح والأداء التعبيري للشباب',
        description: 'تدريب عملي تفاعلي على تقنيات الارتجال المسرحي، الإلقاء، والتحكم في الفضاء الركحي تحت إشراف أطر فنية معتمدة.',
      },
      {
        locale: 'fr',
        title: 'Atelier Théâtre & Expression Scénique',
        description: "Formation pratique et interactive aux techniques d'improvisation théâtrale et d'expression corporelle.",
      },
      {
        locale: 'en',
        title: 'Theatre & Performing Arts Youth Masterclass',
        description: 'Interactive hands-on masterclass focusing on dramatic improvisation, vocal delivery, and stage presence.',
      },
    ],
  },
  {
    slug: 'heritage-music-evening',
    status: 'published' as const,
    start_date: '2026-12-05T18:30:00Z',
    end_date: '2026-12-05T21:30:00Z',
    venue: 'فضاء الفنون والعروض',
    city: 'الدار البيضاء',
    capacity: 80,
    registration_open: true,
    cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    translations: [
      {
        locale: 'ar',
        title: 'أمسية التراث الموسيقي المغربي الأصيل',
        description: 'حفل موسيقي شبابي يحتفي بالروافد الموسيقية المغربية الأصيلة، بمشاركة مواهب صاعدة في العزف والغناء التراثي.',
      },
      {
        locale: 'fr',
        title: 'Soirée du Patrimoine Musical Marocain',
        description: 'Concert acoustique célébrant la richesse des mélodies marocaines traditionnelles avec de jeunes talents.',
      },
      {
        locale: 'en',
        title: 'Moroccan Heritage Music Evening',
        description: 'An acoustic celebration of authentic Moroccan musical roots featuring promising emerging young musicians.',
      },
    ],
  },
  {
    slug: 'youth-creative-forum',
    status: 'published' as const,
    start_date: '2026-12-20T10:00:00Z',
    end_date: '2026-12-20T17:00:00Z',
    venue: 'دار الشباب والأنشطة الثقافية',
    city: 'مراكش',
    capacity: 60,
    registration_open: true,
    cover_image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    translations: [
      {
        locale: 'ar',
        title: 'ملتقى مبادرة شباب في العمل للتطوع الثقافي',
        description: 'يوم دراسي وورشات تدريبية تجمع متطوعي مبادرة شباب في العمل لتقييم المبادرات وتخطيط الأنشطة الثقافية المقبلة.',
      },
      {
        locale: 'fr',
        title: 'Forum Jeunesse en Action & Volontariat Culturel',
        description: "Journée d'échange et de formation réunissant les bénévoles de Jeunesse en Action pour planifier les projets.",
      },
      {
        locale: 'en',
        title: 'Youth in Action Forum & Cultural Volunteering',
        description: 'A full-day strategy and workshop gathering bringing Youth in Action volunteers together to co-design upcoming initiatives.',
      },
    ],
  },
]

export async function seedDefaultEventsIfEmpty(): Promise<boolean> {
  try {
    const supabase = createAdminClient()
    const { count, error: countErr } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })

    if (countErr || (typeof count === 'number' && count > 0)) {
      return false
    }

    for (const item of defaultEventsData) {
      const { translations, ...eventData } = item
      const { data: insertedEvent, error: evErr } = await supabase
        .from('events')
        .upsert(eventData, { onConflict: 'slug' })
        .select('id')
        .single()

      if (evErr || !insertedEvent) continue

      for (const trans of translations) {
        await supabase
          .from('event_translations')
          .upsert(
            {
              event_id: insertedEvent.id,
              locale: trans.locale,
              title: trans.title,
              description: trans.description,
            },
            { onConflict: 'event_id,locale' }
          )
      }
    }
    return true
  } catch {
    return false
  }
}
