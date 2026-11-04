import { createAdminClient } from '@/lib/supabase/admin'

export interface DefaultNewsItem {
  slug: string
  category: string
  status: 'published' | 'draft'
  cover_image: string
  published_at: string
  translations: {
    locale: 'ar' | 'fr' | 'en'
    title: string
    excerpt: string
    content: string
  }[]
}

export const defaultNewsArticlesData: DefaultNewsItem[] = [
  {
    slug: 'official-launch',
    category: 'press',
    status: 'published',
    cover_image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    published_at: '2026-10-15T10:00:00Z',
    translations: [
      {
        locale: 'ar',
        title: 'الإطلاق الرسمي للمنصة الرقمية لجمعية روح الفنون والثقافة (AMYCC)',
        excerpt: 'تعلن الجمعية عن تدشين موقعها الإلكتروني التفاعلي بـ 3 لغات رسمية لتعزيز التواصل المجتمعي، وتيسير طلبات الانخراط والتطوع، ومتابعة أجندة الفعاليات الثقافية.',
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">يسر جمعية روح الفنون والثقافة (AMYCC) أن تعلن عن إطلاق منصتها الرقمية الرسمية التفاعلية بـ 3 لغات (العربية، الفرنسية، والإنجليزية)، في خطوة استراتيجية تهدف إلى رقمنة خدمات الجمعية وتوسيع قاعدة المشاركة الشبابية في المشهد الثقافي والفني الوطني.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">تتيح المنصة الجديدة لعموم الزوار والمهتمين بالعمل الثقافي تقديم طلبات الانخراط والعضوية إلكترونياً، التسجيل المباشر في الفعاليات والورشات التكوينية، والانضمام إلى مبادرة "شباب في العمل" للتطوع الميداني، بالإضافة إلى الاطلاع على البلاغات الصحفية والتقارير الدورية بكل وضوح وشفافية.</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#bd3227]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    "يشكل إطلاق هذه المنصة التفاعلية نقلة نوعية نحو تقريب العمل الجمعوي الثقافي من الشباب المغربي وتوفير قنوات عصرية للتواصل والتطوع والتأطير الفني المستمر."
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— المكتب التنفيذي، جمعية روح الفنون والثقافة (AMYCC)</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">تدعو إدارة الجمعية جميع الشباب، المبدعين، والفاعلين الجمعويين إلى استكشاف أقسام الموقع والتفاعل مع برامج الموسم الثقافي الحالي.</p>`,
      },
      {
        locale: 'fr',
        title: "Lancement officiel de la plateforme numérique de l'Association AMYCC",
        excerpt: "L'association inaugure sa plateforme web trilingue facilitant les démarches d'adhésion, l'engagement bénévole et le suivi des manifestations culturelles.",
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">L'Association Esprit des Arts et de la Culture (AMYCC) a l'immense plaisir d'annoncer le lancement officiel de sa plateforme numérique interactive en trois langues (arabe, français et anglais), marquant une étape stratégique dans la modernisation de son action associative.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">Ce nouveau portail offre un accès simplifié aux candidatures d'adhésion, à l'inscription en ligne aux ateliers et événements, ainsi qu'au programme de bénévolat « Jeunesse en Action ».</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#bd3227]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    « Cette plateforme numérique incarne notre engagement résolu à rapprocher la culture des jeunes et à offrir des espaces dynamiques d'expression artistique et d'engagement citoyen. »
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— Direction Exécutive, AMYCC</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">Nous invitons l'ensemble des créateurs, étudiants et passionnés d'art à découvrir nos programmes et à participer activement à la vie culturelle.</p>`,
      },
      {
        locale: 'en',
        title: 'Official Launch of the AMYCC Digital Platform',
        excerpt: 'AMYCC officially launches its trilingual digital portal to foster community participation, streamline membership applications, and publish its cultural agenda.',
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">The Spirit of Arts and Culture Association (AMYCC) proudly announces the official launch of its trilingual digital platform (Arabic, French, and English), setting a new standard for cultural engagement and youth empowerment.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">The portal features seamless membership processing, direct event registration, volunteer applications under the "Youth in Action" banner, and real-time news updates on Morocco's creative scene.</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#bd3227]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    "Our new interactive digital home is designed to empower young creators, build creative bridges across communities, and bring authentic cultural programming closer to everyone."
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— Executive Board, AMYCC</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">We welcome artists, students, and cultural practitioners across Morocco and abroad to explore our platform and engage with our community.</p>`,
      },
    ],
  },
  {
    slug: 'youth-in-action-call',
    category: 'youth',
    status: 'published',
    cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    published_at: '2026-10-20T14:30:00Z',
    translations: [
      {
        locale: 'ar',
        title: 'فتح باب الترشيح للتطوع ضمن مبادرة "شباب في العمل" لموسم 2026',
        excerpt: 'تدعو جمعية روح الفنون والثقافة كافة الطاقات الشابة والطلبة الراغبين في خوض تجربة جمعوية مميزة للتسجيل في الفوج الأول من متطوعي التنشيط الثقافي.',
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">في سياق تفعيل أهدافها الرامية إلى تشجيع العمل التطوعي وتأطير الطاقات الشابة، تعلن جمعية روح الفنون والثقافة (AMYCC) عن فتح باب الترشيح للالتحاق بالفوج الأول من مبادرة <strong>"شباب في العمل"</strong> لموسم 2026.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">تهدف المبادرة إلى إشراك الطلبة وخريجي المعاهد والشباب المهتمين بالفنون في تنظيم وإدارة التظاهرات الثقافية، وتوثيق التراث الفني، وتنسيق الأنشطة الإبداعية في دور الشباب والمراكز الثقافية الشريكة.</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#231f20]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    "التطوع الثقافي هو المحرك الأساسي لتنمية الشخصية وصقل المهارات القيادية والتواصلية لدى الشباب، ومبادرة شباب في العمل هي الحاضنة المثالية لهذه الطاقات."
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— منسق مبادرة شباب في العمل</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">يستفيد المتطوعون من ورشات تدريبية متخصصة في تدبير المشاريع الثقافية، إضافة إلى شهادات تقديرية رسمية تثبت مشاركتهم وخبرتهم المكتسبة.</p>`,
      },
      {
        locale: 'fr',
        title: 'Appel à candidatures pour l\'initiative "Jeunesse en Action" 2026',
        excerpt: 'L\'AMYCC invite les jeunes et étudiants souhaitant s\'engager dans une aventure associative enrichissante à rejoindre la première promotion de bénévoles.',
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">L'Association Esprit des Arts et de la Culture lance un appel à candidatures pour la première cohorte de son programme phare <strong>« Jeunesse en Action »</strong> pour la saison 2026.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">Cette initiative offre aux jeunes et étudiants une immersion concrète dans la gestion culturelle, la logistique événementielle et l'animation d'ateliers d'expression artistique.</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#231f20]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    « L'engagement bénévole permet aux jeunes de développer des compétences clés en leadership et en gestion de projets artistiques tout en contribuant au dynamisme de leur région. »
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— Coordination Jeunesse en Action</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">Les bénévoles sélectionnés bénéficieront d'un programme d'accompagnement et d'attestations certifiant leurs acquis pratiques.</p>`,
      },
      {
        locale: 'en',
        title: 'Call for Applications: Youth in Action Volunteering Program 2026',
        excerpt: 'AMYCC invites passionate young people and students to apply for the inaugural cohort of cultural event volunteers and leaders.',
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">AMYCC officially opens applications for the 2026 cohort of our flagship community initiative, <strong>"Youth in Action"</strong>.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">Designed for motivated university students and young creatives, this program provides direct hands-on experience in festival logistics, digital storytelling, stage production, and community arts outreach.</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#231f20]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    "Cultural volunteering empowers youth with real-world project leadership, fostering collaborative creativity and positive community impact."
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— Youth in Action Coordinator</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">All active participants will receive certificates of contribution and specialized workshop mentorship.</p>`,
      },
    ],
  },
  {
    slug: 'theatre-workshops-launch',
    category: 'culture',
    status: 'published',
    cover_image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80',
    published_at: '2026-10-22T16:00:00Z',
    translations: [
      {
        locale: 'ar',
        title: 'انطلاق سلسلة الورشات المسرحية والتعبير الركحي لفائدة شباب دور الشباب',
        excerpt: 'في إطار برنامج التكوين المسرحي والتراثي، تعلن الجمعية عن انطلاق الورشات التكوينية الركحية المؤطرة من طرف أساتذة وممارسين محترفين لتمكين الشباب من تقنيات الأداء المسرحي.',
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">أطلقت جمعية روح الفنون والثقافة (AMYCC) برنامجها التكويني السنوي الخاص بـ <strong>ورشات المسرح وفنون الأداء التعبيري</strong>، الموجهة لصالح المواهب الصاعدة وشباب الفضاءات الثقافية.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">يشمل البرنامج حصصاً تدريبية مكثفة تشمل تقنيات الارتجال، الإلقاء الصوتي، التعبير الجسدي، والتحكم في الفضاء المسرحي، بإشراف نخبة من المؤطرين والمخرجين المحترفين.</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#bd3227]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    "المسرح مدرسة للحياة وأداة قوية لبناء الثقة بالنفس واكتشاف الطاقات التعبيرية الكامنة لدى الشباب."
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— لجنة الفنون الدرامية، AMYCC</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">ستتوج هذه الورشات بإنتاج عروض مسرحية شبابية تقدم أمام الجمهور في ختام الموسم الثقافي في مختلف مدن المملكة.</p>`,
      },
      {
        locale: 'fr',
        title: 'Coup d’envoi du cycle d’ateliers de théâtre et d’expression scénique pour les jeunes',
        excerpt: 'Dans le cadre de son programme d’expression théâtrale, l’AMYCC déploie une série de masterclasses animées par des professionnels des arts vivants.',
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">L'AMYCC donne le coup d'envoi de son cycle annuel d'ateliers dédié à <strong>l'art théâtral et à l'expression scénique</strong> à destination des jeunes talents émergents.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">Animées par des metteurs en scène et artistes confirmés, ces masterclasses abordent le travail de la voix, l'improvisation et la présence corporelle sur scène.</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#bd3227]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    « Le théâtre offre aux jeunes un formidable espace de liberté et d'émancipation créative, renforçant leur confiance personnelle. »
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— Commission des Arts Vivants, AMYCC</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">Ce cycle d'ateliers culminera avec la présentation de pièces originales créées et interprétées par les participants.</p>`,
      },
      {
        locale: 'en',
        title: 'Kickoff of Scenic Theatre & Youth Expressive Performance Workshops',
        excerpt: 'AMYCC launches its flagship theatre coaching workshops guided by seasoned theatrical directors to cultivate emerging talent across cultural venues.',
        content: `<p class="mb-5 text-base sm:text-lg leading-relaxed">AMYCC has officially launched its annual training series focusing on <strong>Theatrical Performance & Dramatic Expression</strong> designed for aspiring young actors.</p>
<p class="mb-5 text-base sm:text-lg leading-relaxed">Led by professional stage directors and seasoned coaches, sessions explore voice modulation, dramatic improvisation, movement, and text interpretation.</p>
<div class="my-8 p-6 rounded-2xl bg-[#FAF8F5] border-s-4 border-[#bd3227]">
  <p class="text-sm sm:text-base font-bold text-[#231f20] leading-relaxed">
    "Theatre is a powerful vehicle for self-discovery and collective creative expression, empowering youth to share their stories with pride."
  </p>
  <span class="block mt-2 text-xs font-mono text-[#5C5A55]">— Dramatic Arts Commission, AMYCC</span>
</div>
<p class="mb-5 text-base sm:text-lg leading-relaxed">The cycle will culminate in public stage showcases produced entirely by participating youth ensembles across Morocco.</p>`,
      },
    ],
  },
]

export async function seedDefaultNewsIfEmpty(force = false): Promise<boolean> {
  try {
    const supabase = createAdminClient()

    if (!force) {
      const { count, error: countErr } = await supabase
        .from('news_articles')
        .select('*', { count: 'exact', head: true })

      if (countErr || (typeof count === 'number' && count > 0)) {
        return false
      }
    }

    for (const item of defaultNewsArticlesData) {
      const { translations, ...articleData } = item
      const { data: insertedArticle, error: artErr } = await supabase
        .from('news_articles')
        .upsert(articleData, { onConflict: 'slug' })
        .select('id')
        .single()

      if (artErr || !insertedArticle) continue

      for (const trans of translations) {
        await supabase
          .from('news_translations')
          .upsert(
            {
              article_id: insertedArticle.id,
              locale: trans.locale,
              title: trans.title,
              excerpt: trans.excerpt,
              content: trans.content,
            },
            { onConflict: 'article_id,locale' }
          )
      }
    }

    return true
  } catch {
    return false
  }
}
