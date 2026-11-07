import type { Locale } from '@/lib/i18n/config'

export type SupportedLocale = Locale

export interface PageSeoMeta {
  title: string
  description: string
  keywords?: string[]
}

export const METADATA_CATALOG: Record<string, Record<Locale, PageSeoMeta>> = {
  home: {
    ar: {
      title: 'جمعية روح الفنون والثقافة بمراكش | تمكين الشباب والتراث المغربي',
      description:
        'جمعية ثقافية بمراكش متخصصة في تأطير الشباب، الإبداع المسرحي، الفنون التشكيلية، صون التراث المغربي، ومبادرات العمل التطوعي الجمعوي بالمملكة المغربية.',
      keywords: [
        'جمعية ثقافية مراكش',
        'تطوع الشباب المغرب',
        'جمعية روح الفنون والثقافة',
        'تمكين الشباب والتراث المغربي',
        'المسرح والفنون التشكيلية مراكش',
        'المجتمع المدني المغرب',
      ],
    },
    fr: {
      title: 'Association Esprit des Arts et de la Culture Marrakech | Jeunesse & Patrimoine',
      description:
        'Association culturelle à Marrakech dédiée à l’autonomisation citoyenne des jeunes, à la création théâtrale, aux arts plastiques et à la valorisation du patrimoine marocain.',
      keywords: [
        'association culturelle Marrakech',
        'bénévolat jeunesse Maroc',
        'Esprit des Arts et de la Culture',
        'patrimoine culturel marocain Marrakech',
        'théâtre et création artistique Marrakech',
      ],
    },
    en: {
      title: 'Spirit of Arts & Culture Association Marrakech | Youth Empowerment & Moroccan Heritage',
      description:
        'Cultural nonprofit NGO in Marrakech empowering Moroccan youth through creative theatre, visual arts, heritage preservation, and civic volunteering initiatives.',
      keywords: [
        'youth arts nonprofit Morocco',
        'cultural association Marrakech',
        'youth volunteering Morocco',
        'Moroccan heritage preservation Marrakech',
        'youth empowerment Morocco arts',
      ],
    },
  },
  about: {
    ar: {
      title: 'من نحن ورسالتنا الثقافية بمراكش | جمعية روح الفنون والثقافة',
      description:
        'تعرف على جمعية روح الفنون والثقافة (AMYCC) بمراكش، أهدافها المؤسسية، قيم الإبداع والشمولية، ورؤيتها للنهوض بالفعل الثقافي وصون التراث المغربي.',
      keywords: ['من نحن AMYCC', 'جمعية روح الفنون والثقافة مراكش', 'أهداف جمعية ثقافية المغرب', 'تاريخ AMYCC'],
    },
    fr: {
      title: "À Propos de l'AMYCC Marrakech | Mission, Vision & Valeurs Citoyennes",
      description:
        "Découvrez l'Association Esprit des Arts et de la Culture à Marrakech : notre manifeste, nos 7 valeurs fondamentales et notre engagement pour la jeunesse marocaine.",
      keywords: ['à propos AMYCC', 'mission association culturelle Marrakech', 'valeurs citoyennes Maroc'],
    },
    en: {
      title: 'About AMYCC Marrakech | Mission, Vision & Cultural Heritage in Morocco',
      description:
        'Learn about Spirit of Arts & Culture Association (AMYCC) based in Marrakech, our founding mission, core values, and dedicated programs for Moroccan youth.',
      keywords: ['about AMYCC', 'cultural NGO Marrakech', 'arts organization Morocco', 'Moroccan youth mission'],
    },
  },
  programs: {
    ar: {
      title: 'دليل البرامج والمشاريع الثقافية بمراكش | AMYCC',
      description:
        'استكشف برامج جمعية روح الفنون والثقافة: محترفات الفنون والتراث، التعبير المسرحي، ومبادرة شباب في العمل للتأطير والإبداع الميداني.',
      keywords: ['برامج ثقافية مراكش', 'ورشات مسرحية مراكش', 'محترفات الفنون التشكيلية', 'شباب في العمل'],
    },
    fr: {
      title: 'Programmes Culturels & Ateliers Créatifs à Marrakech | AMYCC',
      description:
        "Découvrez les initiatives de l'AMYCC : ateliers d'arts visuels, formation scénique, théâtre citoyen et notre grand programme Jeunesse en Action.",
      keywords: ['programmes artistiques Marrakech', 'ateliers théâtre Maroc', 'formation artistique jeunes Marrakech'],
    },
    en: {
      title: 'Cultural Programs & Creative Youth Workshops Marrakech | AMYCC',
      description:
        'Explore AMYCC creative tracks: plastic arts and heritage ateliers, scenic theatre expression, and the flagship Youth in Action civic initiative in Morocco.',
      keywords: ['cultural programs Marrakech', 'youth workshops Morocco', 'arts initiatives Marrakech'],
    },
  },
  annualProgram: {
    ar: {
      title: 'البرنامج السنوي الثقافي 2026 بمراكش | جمعية روح الفنون والثقافة',
      description:
        'الأجندة السنوية الكاملة 2026 لأنشطة ومحطات جمعية روح الفنون والثقافة بمراكش وجهات المملكة، والمحاور الأربعة للموسم الإبداعي.',
      keywords: ['البرنامج السنوي 2026', 'أجندة أنشطة ثقافية مراكش', 'مهرجانات AMYCC 2026'],
    },
    fr: {
      title: 'Programme Culturel Annuel 2026 à Marrakech | AMYCC',
      description:
        "Consultez l'agenda annuel 2026 de l'AMYCC : 4 trimestres d'actions artistiques, résidences de création et grands rendez-vous jeunesse au Maroc.",
      keywords: ['programme annuel 2026 Marrakech', 'agenda culturel Maroc 2026', 'événements AMYCC'],
    },
    en: {
      title: 'Annual Cultural Program 2026 Marrakech | AMYCC Morocco',
      description:
        'Complete 2026 seasonal roadmap for AMYCC in Marrakech: four seasonal pillars of youth artistic residency, heritage festivals, and civic theatre.',
      keywords: ['annual program 2026 Marrakech', 'Morocco cultural schedule 2026', 'youth arts calendar'],
    },
  },
  events: {
    ar: {
      title: 'أجندة الفعاليات الثقافية والعروض المسرحية بمراكش | AMYCC',
      description:
        'مواعيد العروض المسرحية، المعارض التشكيلية، الأمسيات الموسيقية، وورشات العمل المفتوحة المنظمة من قبل جمعية روح الفنون والثقافة بمراكش.',
      keywords: ['فعاليات مراكش الثقافية', 'عروض مسرحية مراكش', 'معارض تشكيلية مراكش', 'تذاكر فعاليات AMYCC'],
    },
    fr: {
      title: 'Agenda des Événements & Spectacles Culturels Marrakech | AMYCC',
      description:
        'Découvrez les dates des spectacles théâtraux, expositions artistiques et rencontres culturelles ouvertes organisées par l’AMYCC à Marrakech.',
      keywords: ['agenda événements Marrakech', 'spectacles théâtre Marrakech', 'expositions culturelles Maroc'],
    },
    en: {
      title: 'Cultural Events & Theatre Performances Calendar Marrakech | AMYCC',
      description:
        'Browse live theatre performances, plastic art showcases, youth concerts, and creative gatherings organized by AMYCC in Marrakech.',
      keywords: ['Marrakech cultural events', 'theatre performances Marrakech', 'Morocco arts calendar'],
    },
  },
  news: {
    ar: {
      title: 'الأخبار والمستجدات والبلاغات الصحفية | جمعية روح الفنون والثقافة',
      description:
        'آخر أخبار جمعية روح الفنون والثقافة بمراكش، البلاغات الصحفية الرسمية، تغطيات المبادرات الميدانية، والملفات الإعلامية المعتمدة.',
      keywords: ['أخبار AMYCC', 'بلاغات صحفية مراكش', 'مستجدات العمل الثقافي المغرب', 'إعلام جمعية الفنون'],
    },
    fr: {
      title: 'Actualités, Presse & Communiqués Officiels Marrakech | AMYCC',
      description:
        'Toute l’actualité de l’AMYCC à Marrakech : communiqués de presse officiels, revues de presse et comptes rendus de nos projets sur le terrain.',
      keywords: ['actualités AMYCC', 'communiqués de presse Marrakech', 'revue de presse culture Maroc'],
    },
    en: {
      title: 'News, Press Releases & Cultural Updates Marrakech | AMYCC',
      description:
        'Stay informed with the latest announcements, official press releases, field dispatches, and media coverage from AMYCC in Marrakech, Morocco.',
      keywords: ['AMYCC news', 'press releases Marrakech', 'Moroccan cultural updates'],
    },
  },
  team: {
    ar: {
      title: 'فريق العمل والمكتب التنفيذي واللجان المتخصصة بمراكش | AMYCC',
      description:
        'تعرف على أعضاء المكتب التنفيذي واللجان الوظيفية لجمعية روح الفنون والثقافة، كفاءات شابة تقود مسيرة الإبداع والتأهيل الميداني.',
      keywords: ['فريق عمل AMYCC', 'المكتب التنفيذي جمعية روح الفنون', 'أعضاء الجمعية مراكش'],
    },
    fr: {
      title: 'Équipe de Direction, Bureau Exécutif & Commissions | AMYCC Marrakech',
      description:
        'Rencontrez les membres du bureau exécutif et des commissions spécialisées de l’AMYCC : des talents passionnés engagés pour la jeunesse marocaine.',
      keywords: ['bureau exécutif AMYCC', 'équipe associative Marrakech', 'gouvernance associative Maroc'],
    },
    en: {
      title: 'Executive Board & Leadership Team Marrakech | AMYCC Morocco',
      description:
        'Meet the executive leadership board and functional commissions steering AMYCC projects in Marrakech and across the Kingdom of Morocco.',
      keywords: ['AMYCC team', 'executive board Marrakech', 'nonprofit leadership Morocco'],
    },
  },
  impact: {
    ar: {
      title: 'الأثر المجتمعي ومؤشرات التنمية الثقافية بالمغرب | AMYCC',
      description:
        'مؤشرات الأثر الاجتماعي لجمعية روح الفنون والثقافة: عدد المستفيدين، الورشات المنجزة، التمكين الثقافي للشباب، ونموذج التقييم التشاركي.',
      keywords: ['أثر مجتمعي مراكش', 'مؤشرات الأثر الثقافي بالمغرب', 'تمكين الشباب بالأرقام AMYCC'],
    },
    fr: {
      title: "Impact Communautaire & Indicateurs d'Impact Culturel | AMYCC",
      description:
        "Mesure de l'impact social et artistique de l'AMYCC : nombre de jeunes formés, retombées citoyennes et démarche d'évaluation rigoureuse au Maroc.",
      keywords: ['impact social Marrakech', 'indicateurs culturels Maroc', 'retombées jeunesse AMYCC'],
    },
    en: {
      title: 'Community Impact & Cultural Metrics Morocco | AMYCC Marrakech',
      description:
        'Discover the measurable community impact of AMYCC: youth beneficiaries, artistic workshops conducted, and civic empowerment across Morocco.',
      keywords: ['community impact Morocco', 'cultural impact metrics Marrakech', 'youth empowerment statistics'],
    },
  },
  partnerships: {
    ar: {
      title: 'الشراكات المؤسسية والتعاون الثقافي بالمغرب | AMYCC',
      description:
        'بناء شراكات التعاون الثقافي والرعاية المجتمعية مع المؤسسات العامة، القطاع الخاص، والمجالس المنتخبة لدعم الإبداع الشبابي بمراكش.',
      keywords: ['شراكات مؤسسية مراكش', 'رعاية ثقافية المغرب', 'تعاون جمعوي مراكش'],
    },
    fr: {
      title: 'Partenariats Institutionnels & Mécénat Culturel | AMYCC Maroc',
      description:
        'Construisez un partenariat durable avec l’AMYCC : collectivités territoriales, mécénat d’entreprise et synergies culturelles à fort impact à Marrakech.',
      keywords: ['partenariats culturels Marrakech', 'mécénat artistique Maroc', 'coopération institutionnelle AMYCC'],
    },
    en: {
      title: 'Institutional Partnerships & Cultural Patronage Morocco | AMYCC',
      description:
        'Partner with AMYCC: strategic alliances with territorial authorities, cultural foundations, and corporate sponsors supporting youth creativity in Morocco.',
      keywords: ['institutional partnerships Morocco', 'cultural patronage Marrakech', 'corporate sponsorship arts'],
    },
  },
  membership: {
    ar: {
      title: 'طلب الانخراط والعضوية السنوية للشباب والفنانين | AMYCC مراكش',
      description:
        'انضم إلى جمعية روح الفنون والثقافة بمراكش: بطاقة العضوية السنوية، الاستفادة من الورشات التكوينية، والمشاركة في القرارات والمبادرات الجمعوية.',
      keywords: ['طلب انخراط AMYCC', 'عضوية جمعية مراكش', 'الانضمام لجمعية ثقافية بالمغرب'],
    },
    fr: {
      title: 'Adhésion & Carte de Membre Annuelle Marrakech | AMYCC',
      description:
        'Rejoignez l’AMYCC à Marrakech : devenez membre actif, participez aux ateliers de création et faites entendre votre voix dans la vie associative.',
      keywords: ['adhésion AMYCC', 'devenir membre Marrakech', 'carte d’adhérent association Maroc'],
    },
    en: {
      title: 'Join AMYCC & Annual Youth Membership Marrakech | AMYCC Morocco',
      description:
        'Become a registered member of AMYCC in Marrakech: access exclusive artistic workshops, volunteer initiatives, and participate in association governance.',
      keywords: ['join AMYCC', 'membership cultural NGO Marrakech', 'annual membership Morocco arts'],
    },
  },
  support: {
    ar: {
      title: 'دعم ورعاية المبادرات الثقافية والشبابية بمراكش | AMYCC',
      description:
        'ساهم في دعم مشاريع جمعية روح الفنون والثقافة عبر التبرع الآمن بواسطة CMI أو التحويل البنكي المباشر لتمكين شباب المغرب وصون التراث.',
      keywords: ['تبرع لجمعية ثقافية', 'دعم مشاريع الشباب مراكش', 'رعاية فنية المغرب CMI'],
    },
    fr: {
      title: 'Soutenir & Parrainer la Création Artistique des Jeunes | AMYCC',
      description:
        'Soutenez l’action citoyenne de l’AMYCC : don sécurisé en ligne par carte marocaine CMI ou virement bancaire pour pérenniser nos ateliers gratuits.',
      keywords: ['don en ligne CMI Marrakech', 'soutenir association culturelle Maroc', 'mécénat solidaire jeunesse'],
    },
    en: {
      title: 'Support & Sponsor Youth Cultural Initiatives Marrakech | AMYCC',
      description:
        'Support AMYCC youth empowerment projects in Marrakech: safe online donations via Moroccan CMI gateway or direct bank transfer for cultural access.',
      keywords: ['donate AMYCC', 'support youth arts Morocco', 'cultural donations Marrakech'],
    },
  },
  contact: {
    ar: {
      title: 'اتصل بنا وقنوات التواصل المباشر بمراكش | AMYCC المغرب',
      description:
        'تواصل مباشرة مع إدارة جمعية روح الفنون والثقافة بمراكش: المقر الإداري، البريد الإلكتروني contact@amycc.org، أرقام الهاتف، وقنوات المراسلة.',
      keywords: ['اتصل بجمعية روح الفنون', 'عنوان AMYCC مراكش', 'بريد contact@amycc.org'],
    },
    fr: {
      title: 'Contactez l’AMYCC Marrakech | Coordonnées & Accès Officiels',
      description:
        'Prenez contact avec l’équipe de l’AMYCC : siège officiel à Marrakech, email contact@amycc.org, numéros de téléphone et formulaire de messagerie directe.',
      keywords: ['contact AMYCC Marrakech', 'adresse association Esprit des Arts', 'email contact@amycc.org'],
    },
    en: {
      title: 'Contact AMYCC Marrakech | Office, Direct Coordinates & Inquiries',
      description:
        'Get in touch with the AMYCC leadership team in Marrakech: registered address, official email contact@amycc.org, phone lines, and direct inquiry form.',
      keywords: ['contact AMYCC Marrakech', 'AMYCC office address', 'email contact@amycc.org'],
    },
  },
  faq: {
    ar: {
      title: 'الأسئلة الشائعة حول الانخراط والتطوع والأنشطة الثقافية | AMYCC',
      description:
        'إجابات دقيقة على تساؤلاتكم حول شروط الانخراط، برنامج التطوع شباب في العمل، مجانية الورشات، وكيفية المشاركة في فعاليات AMYCC بمراكش.',
      keywords: ['أسئلة شائعة AMYCC', 'كيفية الانخراط بجمعية روح الفنون', 'شروط التطوع بمراكش'],
    },
    fr: {
      title: 'Foire Aux Questions (FAQ) — Adhésion, Bénévolat & Projets | AMYCC',
      description:
        'Consultez nos réponses claires sur les conditions d’adhésion, le bénévolat Jeunesse en Action, la gratuité des ateliers et l’accueil à Marrakech.',
      keywords: ['FAQ AMYCC', 'questions adhésion culturelle Marrakech', 'bénévolat FAQ Maroc'],
    },
    en: {
      title: 'Frequently Asked Questions (FAQ) — Membership & Volunteering | AMYCC',
      description:
        'Get answers to frequently asked questions about joining AMYCC, youth volunteering opportunities, workshop participation, and partnerships in Morocco.',
      keywords: ['FAQ AMYCC', 'questions cultural association Morocco', 'volunteering FAQ Marrakech'],
    },
  },
  privacy: {
    ar: {
      title: 'سياسة الخصوصية وحماية المعطيات الشخصية | AMYCC المغرب',
      description:
        'التزام جمعية روح الفنون والثقافة بحماية خصوصية الزوار والمنخرطين وفق مقتضيات القانون المغربي رقم 09-08 واللجنة الوطنية CNDP.',
      keywords: ['سياسة الخصوصية AMYCC', 'حماية المعطيات الشخصية المغرب 09-08', 'CNDP مراكش'],
    },
    fr: {
      title: 'Politique de Confidentialité & Protection des Données CNDP | AMYCC',
      description:
        'Politique de protection des données personnelles de l’AMYCC, conforme à la loi marocaine n° 09-08 et aux standards de la CNDP.',
      keywords: ['politique confidentialité AMYCC', 'protection données loi 09-08 Maroc', 'CNDP AMYCC'],
    },
    en: {
      title: 'Privacy Policy & Moroccan CNDP Data Protection | AMYCC',
      description:
        'AMYCC privacy policy and personal data protection measures compliant with Moroccan Law No. 09-08 and CNDP regulatory standards.',
      keywords: ['privacy policy AMYCC', 'Moroccan data protection law 09-08', 'CNDP compliance Morocco'],
    },
  },
}
