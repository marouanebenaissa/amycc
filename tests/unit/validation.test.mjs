import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'

// 1. Re-validate Schema Logic
const membershipSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  city: z.string().min(2).max(50),
  profession: z.string().max(100).optional(),
  interests: z.array(z.string()).default([]),
  motivation: z.string().min(10).max(1000),
})

const volunteerSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20).optional(),
  city: z.string().min(2).max(50),
  skills: z.string().min(3).max(500),
  availability: z.string().min(2).max(100),
  areasOfInterest: z.array(z.string()).default([]),
  experience: z.string().max(1000).optional(),
  initiative: z.string().default('Youth in Action'),
})

describe('Membership Validation Suite', () => {
  test('accepts valid membership application', () => {
    const valid = {
      fullName: 'Yassine Alami',
      email: 'yassine@example.com',
      phone: '+212600000000',
      city: 'Rabat',
      profession: 'Musician',
      interests: ['music', 'youth'],
      motivation: 'I want to contribute to Moroccan cultural heritage.',
    }
    const result = membershipSchema.safeParse(valid)
    assert.equal(result.success, true)
  })

  test('rejects invalid email address', () => {
    const invalid = {
      fullName: 'Yassine Alami',
      email: 'not-an-email',
      phone: '+212600000000',
      city: 'Rabat',
      motivation: 'Short mot',
    }
    const result = membershipSchema.safeParse(invalid)
    assert.equal(result.success, false)
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.email)
    }
  })

  test('rejects short motivation under 10 chars', () => {
    const invalid = {
      fullName: 'Yassine Alami',
      email: 'test@example.com',
      phone: '+212600000000',
      city: 'Rabat',
      motivation: 'Too short',
    }
    const result = membershipSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

describe('Volunteer Validation Suite', () => {
  test('accepts valid volunteer with Youth in Action default initiative', () => {
    const valid = {
      fullName: 'Fatima Zahra',
      email: 'fatima@example.com',
      city: 'Casablanca',
      skills: 'Theatre coordination and workshop moderation',
      availability: 'Weekends',
      areasOfInterest: ['theatre', 'volunteering'],
    }
    const result = volunteerSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.initiative, 'Youth in Action')
    }
  })

  test('rejects missing skills description', () => {
    const invalid = {
      fullName: 'Fatima Zahra',
      email: 'fatima@example.com',
      city: 'Casablanca',
      skills: '',
      availability: 'Weekends',
    }
    const result = volunteerSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

describe('Multilingual Directionality & Locales', () => {
  const locales = ['ar', 'fr', 'en']
  const localeDir = { ar: 'rtl', fr: 'ltr', en: 'ltr' }

  test('Arabic is configured as RTL', () => {
    assert.equal(localeDir.ar, 'rtl')
  })

  test('French and English are configured as LTR', () => {
    assert.equal(localeDir.fr, 'ltr')
    assert.equal(localeDir.en, 'ltr')
  })

  test('all 3 core locales are registered', () => {
    assert.deepEqual(locales, ['ar', 'fr', 'en'])
  })
})

const faqItemSchema = z.object({
  id: z.string().min(1),
  questionAr: z.string().min(3),
  questionFr: z.string().optional(),
  questionEn: z.string().optional(),
  answerAr: z.string().min(5),
  answerFr: z.string().optional(),
  answerEn: z.string().optional(),
  category: z.enum(['general', 'membership', 'volunteering', 'partnerships', 'events']).default('general'),
  showOnHome: z.boolean().default(true),
  published: z.boolean().default(true),
  order: z.number().int().min(1).default(1),
})

describe('FAQ Validation Suite', () => {
  test('accepts valid trilingual FAQ item', () => {
    const valid = {
      id: 'faq-1',
      questionAr: 'ما هي الجمعية؟',
      questionFr: "Qu'est-ce que l'association ?",
      questionEn: 'What is the association?',
      answerAr: 'جمعية روح الفنون والثقافة المغربية.',
      answerFr: 'Association marocaine des arts.',
      answerEn: 'Moroccan arts association.',
      category: 'general',
      showOnHome: true,
      published: true,
      order: 1,
    }
    const result = faqItemSchema.safeParse(valid)
    assert.equal(result.success, true)
  })

  test('rejects FAQ with empty Arabic question or answer', () => {
    const invalid = {
      id: 'faq-invalid',
      questionAr: '',
      answerAr: '',
    }
    const result = faqItemSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const areaItemSchema = z.object({
  key: z.string().min(1),
  titleAr: z.string().min(2),
  tagAr: z.string().min(2),
  descAr: z.string().min(5),
  headlineAr: z.string().min(5),
  objectivesAr: z.array(z.string()).default([]),
  initiativesAr: z.array(z.string()).default([]),
  actionUrl: z.string().default('/programs'),
  order: z.number().int().min(1).default(1),
  enabled: z.boolean().default(true),
  showInitiatives: z.boolean().default(true),
})

describe('Intervention Areas Validation Suite', () => {
  test('accepts valid core discipline item with modal details', () => {
    const valid = {
      key: 'arts',
      titleAr: 'الفنون والإبداع',
      tagAr: 'محترفات تشكيلية ومعارض',
      descAr: 'الفنون التشكيلية والرسم والابتكار.',
      headlineAr: 'رعاية المواهب وصقل الحس الجمالي.',
      objectivesAr: ['تنظيم ورشات الرسم', 'إقامة معارض'],
      initiativesAr: ['محترف إعداد الفنانين'],
      actionUrl: '/programs',
      order: 1,
      enabled: true,
      showInitiatives: false,
    }
    const result = areaItemSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.showInitiatives, false)
    }
  })

  test('rejects area item with empty title or description', () => {
    const invalid = {
      key: 'arts',
      titleAr: '',
      tagAr: '',
      descAr: '',
      headlineAr: '',
    }
    const result = areaItemSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const teamMemberSchema = z.object({
  id: z.string().min(1),
  nameAr: z.string().default(''),
  nameFr: z.string().default(''),
  nameEn: z.string().default(''),
  roleAr: z.string().min(2),
  roleFr: z.string().default(''),
  roleEn: z.string().default(''),
  category: z.enum(['executive', 'committee', 'advisor']).default('executive'),
  titleStatusAr: z.string().default(''),
  badgeStatusAr: z.string().default(''),
  descAr: z.string().default(''),
  dutiesAr: z.array(z.string()).default([]),
  photoUrl: z.string().default(''),
  icon: z.string().default('👤'),
  colorClass: z.string().default('border-[#0d3b43]/30 hover:border-[#0d3b43]'),
  accentBg: z.string().default('bg-[#0d3b43]/10 text-[#0d3b43]'),
  order: z.number().int().min(1).default(1),
  enabled: z.boolean().default(true),
})

describe('Team Validation Suite', () => {
  test('accepts valid team member with uploaded photo and statutory role', () => {
    const valid = {
      id: 'member-101',
      nameAr: 'أحمد المرابط',
      nameFr: 'Ahmed El Mourabit',
      nameEn: 'Ahmed El Mourabit',
      roleAr: 'رئيس الجمعية',
      roleFr: 'Président',
      roleEn: 'President',
      category: 'executive',
      titleStatusAr: 'التمثيل القانوني والتوجيه الاستراتيجي',
      badgeStatusAr: 'عضوية معتمدة بالنظام الأساسي',
      descAr: 'التمثيل الرسمي للجمعية وتنسيق العمل التشاركي.',
      dutiesAr: ['إبرام الشراكات', 'السهر على احترام القانون الأساسي'],
      photoUrl: 'https://example.com/uploads/president.jpg',
      icon: '🏛️',
      order: 1,
      enabled: true,
    }
    const result = teamMemberSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.category, 'executive')
      assert.equal(result.data.photoUrl, 'https://example.com/uploads/president.jpg')
    }
  })

  test('rejects team member with missing or too short role title', () => {
    const invalid = {
      id: 'member-invalid',
      roleAr: '',
    }
    const result = teamMemberSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const commissionItemSchema = z.object({
  id: z.string().min(1),
  titleAr: z.string().min(2),
  tagAr: z.string().min(2),
  descAr: z.string().min(5),
  icon: z.string().default('🎨'),
  pointsAr: z.array(z.string()).default([]),
  order: z.number().int().min(1).default(1),
  enabled: z.boolean().default(true),
})

describe('Commissions Validation Suite', () => {
  test('accepts valid working commission with field interventions', () => {
    const valid = {
      id: 'theatre',
      titleAr: 'لجنة المسرح وفنون الأداء',
      tagAr: 'أداء تعبيري وخشبة',
      descAr: 'تأطير ورشات التشخيص المسرحي والإلقاء.',
      icon: '🎭',
      pointsAr: ['محترفات الارتجال المسرحي', 'إنتاج مسرحيات شبابية'],
      order: 1,
      enabled: true,
    }
    const result = commissionItemSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.icon, '🎭')
      assert.equal(result.data.pointsAr.length, 2)
    }
  })

  test('rejects commission with empty title or description', () => {
    const invalid = {
      id: 'comm-invalid',
      titleAr: '',
      tagAr: '',
      descAr: '',
    }
    const result = commissionItemSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const teamHeroSchema = z.object({
  imageUrl: z.string().default(''),
  showImage: z.boolean().default(true),
  badge1Ar: z.string().optional(),
  badge2Ar: z.string().optional(),
  titleAr: z.string().min(5),
  descriptionAr: z.string().min(10),
})

describe('Team Hero Validation Suite', () => {
  test('accepts valid team hero configuration with image and typography', () => {
    const valid = {
      imageUrl: '/images/youth-in-action.jpg',
      showImage: true,
      badge1Ar: 'الهيكل الإداري والتنظيمي المعتمد • جمعية AMYCC',
      badge2Ar: 'تأطير وطني بروح شبابية مسؤولة 🇲🇦',
      titleAr: 'طاقات شبابية وكفاءات ثقافية تقود مسيرة الإبداع',
      descriptionAr: 'يتألف فريق عمل جمعية روح الفنون والثقافة من كفاءات وطنية ملتزمة.',
    }
    const result = teamHeroSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.showImage, true)
      assert.equal(result.data.imageUrl, '/images/youth-in-action.jpg')
    }
  })

  test('rejects hero configuration with too short title or description', () => {
    const invalid = {
      titleAr: 'قصير',
      descriptionAr: 'قصير',
    }
    const result = teamHeroSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const contactConfigSchema = z.object({
  channels: z.object({
    primaryEmail: z.string().email(),
    phone: z.string().min(5),
    addressAr: z.string().min(5),
    workingHoursAr: z.string().min(5),
  }),
  departments: z.array(
    z.object({
      id: z.string().min(1),
      titleAr: z.string().min(2),
      email: z.string().email(),
      icon: z.string(),
    })
  ).min(1),
  formTopics: z.array(
    z.object({
      id: z.string().min(1),
      labelAr: z.string().min(3),
    })
  ).min(1),
})

describe('Contact Configuration Validation Suite', () => {
  test('accepts valid contact configuration with channels and departments', () => {
    const valid = {
      channels: {
        primaryEmail: 'contact@amycc.org',
        phone: '+212 5 24 00 00 00',
        addressAr: 'مراكش، المملكة المغربية',
        workingHoursAr: 'من الاثنين إلى الجمعة: 09:00 - 18:00',
      },
      departments: [
        { id: 'general', titleAr: 'الكتابة العامة', email: 'contact@amycc.org', icon: '✉️' },
        { id: 'press', titleAr: 'الصحافة والإعلام', email: 'press@amycc.org', icon: '📰' },
      ],
      formTopics: [
        { id: 'general', labelAr: 'استفسار عام حول أنشطة الجمعية' },
      ],
    }
    const result = contactConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.channels.primaryEmail, 'contact@amycc.org')
      assert.equal(result.data.departments.length, 2)
    }
  })

  test('rejects contact configuration with invalid email or empty channels', () => {
    const invalid = {
      channels: {
        primaryEmail: 'invalid-email',
        phone: '',
        addressAr: '',
        workingHoursAr: '',
      },
      departments: [],
      formTopics: [],
    }
    const result = contactConfigSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const programsPageConfigSchema = z.object({
  hero: z.object({
    tagAr: z.string().min(2),
    titleAr: z.string().min(5),
    descriptionAr: z.string().min(10),
  }),
  stats: z.array(
    z.object({
      id: z.string().min(1),
      value: z.string().min(1),
      labelAr: z.string().min(2),
      icon: z.string(),
    })
  ).min(1),
  cta: z.object({
    titleAr: z.string().min(5),
    descAr: z.string().min(10),
    primaryBtnTextAr: z.string().min(2),
    primaryBtnUrl: z.string().min(1),
  }),
})

describe('Programs Page Validation Suite', () => {
  test('accepts valid programs page configuration with hero, stats, and cta', () => {
    const valid = {
      hero: {
        tagAr: 'بوابة البرامج والمشاريع الثقافية',
        titleAr: 'برامجنا ومبادراتنا لاكتشاف المواهب وبناء الأثر',
        descriptionAr: 'تضع جمعية روح الفنون والثقافة في صلب رسالتها إطلاق برامج ومبادرات مستمرة...',
      },
      stats: [
        { id: 'stat-1', value: '+1,500', labelAr: 'مستفيد ومستفيدة من الورشات', icon: '👥' },
        { id: 'stat-2', value: '12', labelAr: 'جهة مستهدفة بالمملكة', icon: '🇲🇦' },
      ],
      cta: {
        titleAr: 'هل لديك فكرة مشروع ثقافي تود إطلاقها معنا؟',
        descAr: 'تفتح جمعية روح الفنون والثقافة أبوابها لتبني ومواكبة الأفكار الإبداعية...',
        primaryBtnTextAr: 'اقترح مبادرتك وتواصل معنا',
        primaryBtnUrl: '/contact',
      },
    }
    const result = programsPageConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.stats.length, 2)
      assert.equal(result.data.hero.tagAr, 'بوابة البرامج والمشاريع الثقافية')
    }
  })

  test('rejects programs page configuration with too short title or empty stats', () => {
    const invalid = {
      hero: {
        tagAr: '',
        titleAr: 'قصير',
        descriptionAr: '',
      },
      stats: [],
      cta: {
        titleAr: '',
        descAr: '',
        primaryBtnTextAr: '',
        primaryBtnUrl: '',
      },
    }
    const result = programsPageConfigSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const annualProgramConfigSchema = z.object({
  hero: z.object({
    badgeAr: z.string().min(1),
    titleAr: z.string().min(3),
    descriptionAr: z.string().min(10),
    seasonYear: z.string().min(1),
    brochurePdfUrl: z.string(),
    heroImageUrl: z.string(),
    hasHeroImage: z.boolean(),
  }),
  stats: z.array(
    z.object({
      id: z.string().min(1),
      value: z.string().min(1),
      labelAr: z.string().min(2),
      icon: z.string(),
    })
  ).min(1),
  pillars: z.array(
    z.object({
      id: z.string().min(1),
      titleAr: z.string().min(2),
      descAr: z.string().min(5),
      icon: z.string(),
    })
  ).min(1),
  quarters: z.array(
    z.object({
      id: z.string().min(1),
      code: z.string().min(1),
      titleAr: z.string().min(2),
      events: z.array(
        z.object({
          id: z.string().min(1),
          titleAr: z.string().min(2),
          status: z.enum(['completed', 'in_progress', 'upcoming']),
        })
      ),
    })
  ).min(1),
  cta: z.object({
    titleAr: z.string().min(5),
    descAr: z.string().min(10),
    primaryBtnTextAr: z.string().min(2),
    primaryBtnUrl: z.string().min(1),
  }),
})

describe('Annual Program Page Validation Suite', () => {
  test('accepts valid annual program configuration with quarters, pillars, and events', () => {
    const valid = {
      hero: {
        badgeAr: 'الموسم الثقافي والشبابي الرسمي',
        titleAr: 'البرنامج الثقافي السنوي 2026',
        descriptionAr: 'برنامج ثقافي شامل على مدار فصول السنة لترسيخ الهوية الفنية بالمغرب.',
        seasonYear: '2026',
        brochurePdfUrl: '/documents/programme-annuel-2026.pdf',
        heroImageUrl: '',
        hasHeroImage: false,
      },
      stats: [
        { id: 'stat-1', value: '+40', labelAr: 'فعالية كبرى', icon: '🎭' },
        { id: 'stat-2', value: '12', labelAr: 'جهة مستفيدة', icon: '🇲🇦' },
      ],
      pillars: [
        { id: 'pillar-1', titleAr: 'الفنون التشكيلية', descAr: 'معارض وورش حية للمواهب الصاعدة', icon: '🎨' },
        { id: 'pillar-2', titleAr: 'المسرح وفنون الأداء', descAr: 'عروض ومهرجانات وطنية بالجهات', icon: '🎭' },
      ],
      quarters: [
        {
          id: 'q1',
          code: 'Q1',
          titleAr: 'فصل الانطلاق والنهضة الفنية',
          events: [
            { id: 'ev-1', titleAr: 'منتدى الإبداع الشبابي 2026', status: 'completed' },
            { id: 'ev-2', titleAr: 'ورشات الفنون المسرحية', status: 'in_progress' },
          ],
        },
      ],
      cta: {
        titleAr: 'استضف فعاليات البرنامج السنوي بجهتك',
        descAr: 'تفتح جمعية روح الفنون والثقافة باب الشراكة مع المراكز الثقافية والجماعات.',
        primaryBtnTextAr: 'طلب شراكة مؤسسية',
        primaryBtnUrl: '/partnerships',
      },
    }
    const result = annualProgramConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.quarters[0].events.length, 2)
      assert.equal(result.data.pillars.length, 2)
    }
  })

  test('rejects annual program configuration with missing quarters or empty fields', () => {
    const invalid = {
      hero: {
        badgeAr: '',
        titleAr: 'ق',
        descriptionAr: 'قصير',
        seasonYear: '',
        brochurePdfUrl: '',
        heroImageUrl: '',
        hasHeroImage: false,
      },
      stats: [],
      pillars: [],
      quarters: [],
      cta: {
        titleAr: '',
        descAr: '',
        primaryBtnTextAr: '',
        primaryBtnUrl: '',
      },
    }
    const result = annualProgramConfigSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const impactConfigSchema = z.object({
  hero: z.object({
    badgeAr: z.string().min(1),
    titleAr: z.string().min(3),
    descriptionAr: z.string().min(10),
    reportPdfUrl: z.string(),
    heroImageUrl: z.string(),
    hasHeroImage: z.boolean(),
  }),
  metrics: z.array(
    z.object({
      id: z.string().min(1),
      value: z.string().min(1),
      labelAr: z.string().min(2),
      subtextAr: z.string(),
      icon: z.string(),
    })
  ).min(1),
  pillars: z.array(
    z.object({
      id: z.string().min(1),
      titleAr: z.string().min(2),
      descAr: z.string().min(5),
      icon: z.string(),
    })
  ).min(1),
  spotlight: z.object({
    badgeAr: z.string().min(1),
    titleAr: z.string().min(3),
    descAr: z.string().min(10),
  }),
  methodology: z.object({
    titleAr: z.string().min(3),
    steps: z.array(
      z.object({
        id: z.string().min(1),
        stepNumber: z.string().min(1),
        titleAr: z.string().min(2),
      })
    ).min(1),
  }),
  transparency: z.object({
    titleAr: z.string().min(3),
    items: z.array(
      z.object({
        id: z.string().min(1),
        titleAr: z.string().min(2),
      })
    ).min(1),
  }),
  cta: z.object({
    titleAr: z.string().min(5),
    descAr: z.string().min(10),
    primaryBtnTextAr: z.string().min(2),
    primaryBtnUrl: z.string().min(1),
  }),
})

describe('Community Impact Page Validation Suite', () => {
  test('accepts valid impact configuration with metrics, pillars, spotlight, and methodology', () => {
    const valid = {
      hero: {
        badgeAr: 'الأثر والالتزام المجتمعي',
        titleAr: 'الأثر المجتمعي والثقافي بالمملكة المغربية',
        descriptionAr: 'تسعى جمعية روح الفنون والثقافة إلى جعل الفنون والإبداع رافعة للتنمية البشرية.',
        reportPdfUrl: '/documents/rapport-impact-2026.pdf',
        heroImageUrl: '',
        hasHeroImage: false,
      },
      metrics: [
        { id: 'm-1', value: '2026', labelAr: 'سنة التأسيس', subtextAr: 'إطار مدني معتمد بالمغرب', icon: '🏛️' },
        { id: 'm-2', value: '+1,500', labelAr: 'مستفيد ومستفيدة', subtextAr: 'في مختلف جهات المملكة', icon: '👥' },
      ],
      pillars: [
        { id: 'p-1', titleAr: 'التمكين الشبابي', descAr: 'فتح المجال أمام الطاقات الشابة للتعبير الحر والتأطير الجمعوي.', icon: '🚀' },
      ],
      spotlight: {
        badgeAr: 'أثر ميداني ملموس',
        titleAr: 'مبادرة شباب في العمل',
        descAr: 'المشاركة الحية في بلورة المبادرات وتأطير الورشات والتنظيم الميداني.',
      },
      methodology: {
        titleAr: 'دورة صناعة الأثر',
        steps: [
          { id: 's-1', stepNumber: '01', titleAr: 'التشخيص ورصد المواهب' },
        ],
      },
      transparency: {
        titleAr: 'النزاهة والشفافية المدنية',
        items: [
          { id: 't-1', titleAr: 'الشرعية المؤسسية والإيداع القانوني' },
        ],
      },
      cta: {
        titleAr: 'شاركنا في توسيع دائرة الأثر الثقافي بالمغرب',
        descAr: 'تفتح الجمعية أبوابها للشراكة الاستراتيجية مع المؤسسات والجماعات.',
        primaryBtnTextAr: 'طلب شراكة مؤسسية',
        primaryBtnUrl: '/partnerships',
      },
    }
    const result = impactConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.metrics.length, 2)
      assert.equal(result.data.methodology.steps.length, 1)
    }
  })

  test('rejects impact configuration with empty metrics or short description', () => {
    const invalid = {
      hero: {
        badgeAr: '',
        titleAr: 'ق',
        descriptionAr: 'قصير',
        reportPdfUrl: '',
        heroImageUrl: '',
        hasHeroImage: false,
      },
      metrics: [],
      pillars: [],
      spotlight: { badgeAr: '', titleAr: '', descAr: '' },
      methodology: { titleAr: '', steps: [] },
      transparency: { titleAr: '', items: [] },
      cta: { titleAr: '', descAr: '', primaryBtnTextAr: '', primaryBtnUrl: '' },
    }
    const result = impactConfigSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const eventsPageConfigSchema = z.object({
  hero: z.object({
    tagAr: z.string().min(1),
    tagFr: z.string().min(1),
    tagEn: z.string().min(1),
    badgeAr: z.string().min(1),
    titleAr: z.string().min(3),
    titleFr: z.string().min(3),
    titleEn: z.string().min(3),
    subtitleAr: z.string().min(3),
    subtitleFr: z.string().min(3),
    subtitleEn: z.string().min(3),
    descriptionAr: z.string().min(10),
    descriptionFr: z.string().min(10),
    descriptionEn: z.string().min(10),
    imageUrl: z.string(),
    hasHeroImage: z.boolean(),
  }),
  stats: z.array(
    z.object({
      id: z.string().min(1),
      value: z.string().min(1),
      labelAr: z.string().min(2),
      labelFr: z.string().min(2),
      labelEn: z.string().min(2),
      icon: z.string(),
    })
  ).min(1),
  cta: z.object({
    badgeAr: z.string().min(1),
    titleAr: z.string().min(5),
    descAr: z.string().min(10),
    primaryBtnTextAr: z.string().min(2),
    primaryBtnUrl: z.string().min(1),
    secondaryBtnTextAr: z.string().min(2),
    secondaryBtnUrl: z.string().min(1),
  }),
})

describe('Events Page Validation Suite', () => {
  test('accepts valid events configuration with hero, Moroccan cultural KPIs, and CTA', () => {
    const valid = {
      hero: {
        tagAr: 'الأجندة الثقافية الحية',
        tagFr: 'Agenda Culturel Vivant',
        tagEn: 'Living Cultural Agenda',
        badgeAr: 'فعاليات وورشات جمعية روح الفنون',
        titleAr: 'الفعاليات والتظاهرات الثقافية والفنية',
        titleFr: 'Événements & Manifestations Artistiques',
        titleEn: 'Cultural Events & Artistic Manifestations',
        subtitleAr: 'منصات للإبداع والتلاقي الشبابي وإحياء التراث عبر مختلف جهات المملكة',
        subtitleFr: 'Des plateformes de création et de dialogue pour la jeunesse au Maroc',
        subtitleEn: 'Platforms for youth creativity and artistic dialogue across Morocco',
        descriptionAr: 'ندعوكم للمشاركة في باقة متنوعة من التظاهرات الفنية، الورشات التكوينية، والمعارض والمهرجانات الهادفة إلى صقل المواهب المغربية.',
        descriptionFr: 'Découvrez notre riche programmation culturelle : ateliers, résidences, concerts et festivals.',
        descriptionEn: 'Explore our vibrant cultural calendar of masterclasses, exhibitions, and musical residencies.',
        imageUrl: '',
        hasHeroImage: false,
      },
      stats: [
        { id: 'ev-stat-1', value: '100%', labelAr: 'مشاركة مجانية', labelFr: 'Participation Gratuite', labelEn: '100% Free Access', icon: '✨' },
        { id: 'ev-stat-2', value: '+50', labelAr: 'ورشة وعرض سنوي', labelFr: 'Ateliers & Spectacles', labelEn: 'Workshops & Shows', icon: '🎭' },
      ],
      cta: {
        badgeAr: 'اقتراح تعاون وشراكة',
        titleAr: 'هل ترغب في تنظيم ورشة عمل أو استضافة فعالية بمدينتك؟',
        descAr: 'تفتح جمعية روح الفنون والثقافة باب التعاون والشراكة مع المراكز الثقافية ودور الشباب.',
        primaryBtnTextAr: 'طلب شراكة أو استضافة فعالية',
        primaryBtnUrl: '/partnerships',
        secondaryBtnTextAr: 'تواصل مع إدارة الفعاليات',
        secondaryBtnUrl: '/contact',
      },
    }
    const result = eventsPageConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.stats.length, 2)
      assert.equal(result.data.hero.tagAr, 'الأجندة الثقافية الحية')
    }
  })

  test('rejects events configuration with missing required fields or empty stats', () => {
    const invalid = {
      hero: {
        tagAr: '',
        tagFr: '',
        tagEn: '',
        badgeAr: '',
        titleAr: 'ق',
        titleFr: 'a',
        titleEn: 'b',
        subtitleAr: 'c',
        subtitleFr: 'd',
        subtitleEn: 'e',
        descriptionAr: 'قصير',
        descriptionFr: 'court',
        descriptionEn: 'short',
        imageUrl: '',
        hasHeroImage: false,
      },
      stats: [],
      cta: {
        badgeAr: '',
        titleAr: '',
        descAr: '',
        primaryBtnTextAr: '',
        primaryBtnUrl: '',
        secondaryBtnTextAr: '',
        secondaryBtnUrl: '',
      },
    }
    const result = eventsPageConfigSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

const newsPageConfigSchema = z.object({
  hero: z.object({
    tagAr: z.string().min(1),
    tagFr: z.string().min(1),
    tagEn: z.string().min(1),
    badgeAr: z.string().min(1),
    titleAr: z.string().min(3),
    titleFr: z.string().min(3),
    titleEn: z.string().min(3),
    subtitleAr: z.string().min(3),
    subtitleFr: z.string().min(3),
    subtitleEn: z.string().min(3),
    descriptionAr: z.string().min(10),
    descriptionFr: z.string().min(10),
    descriptionEn: z.string().min(10),
    imageUrl: z.string(),
    hasHeroImage: z.boolean(),
  }),
  stats: z.array(
    z.object({
      id: z.string().min(1),
      value: z.string().min(1),
      labelAr: z.string().min(2),
      labelFr: z.string().min(2),
      labelEn: z.string().min(2),
      icon: z.string(),
    })
  ).min(1),
  cta: z.object({
    badgeAr: z.string().min(1),
    titleAr: z.string().min(5),
    descAr: z.string().min(10),
    primaryBtnTextAr: z.string().min(2),
    primaryBtnUrl: z.string().min(1),
    secondaryBtnTextAr: z.string().min(2),
    secondaryBtnUrl: z.string().min(1),
  }),
})

describe('News Page Validation Suite', () => {
  test('accepts valid news configuration with hero, press media KPIs, and CTA', () => {
    const valid = {
      hero: {
        tagAr: 'المركز الإعلامي والبيانات الرسمية',
        tagFr: 'Espace Presse & Actualités',
        tagEn: 'Media Center & Official Press',
        badgeAr: 'مستجدات الموسم الثقافي 2026 • AMYCC News',
        titleAr: 'الأخبار والبيانات الصحفية',
        titleFr: 'Actualités & Communiqués de Presse',
        titleEn: 'News, Insights & Press Releases',
        subtitleAr: 'تغطية شاملة للمبادرات الفنية، الورشات الإبداعية، والأنشطة الشبابية لجمعية روح الفنون والثقافة',
        subtitleFr: 'Couverture complète des initiatives artistiques et événements jeunesse',
        subtitleEn: 'Comprehensive coverage of artistic initiatives and youth programs',
        descriptionAr: 'تابعوا أحدث أخبار جمعية روح الفنون والثقافة، والبيانات الرسمية الموجهة لوسائل الإعلام عبر ربوع المملكة.',
        descriptionFr: 'Suivez toute l’actualité de l’AMYCC : annonces institutionnelles et dossiers de presse.',
        descriptionEn: 'Discover the latest news from AMYCC: press announcements and cultural project reports.',
        imageUrl: '',
        hasHeroImage: false,
      },
      stats: [
        { id: 'stat-articles', value: '+40', labelAr: 'تغطية إعلامية ومقال موثق', labelFr: 'Articles publiés', labelEn: 'Articles', icon: '📰' },
        { id: 'stat-releases', value: '100%', labelAr: 'بيانات صحفية ومعلومات موثوقة', labelFr: 'Communiqués vérifiés', labelEn: 'Press Releases', icon: '🏛️' },
      ],
      cta: {
        badgeAr: 'العلاقات مع الصحافة والإعلام',
        titleAr: 'هل أنت صحفي أو مؤسسة إعلامية ترغب في تغطية أنشطتنا؟',
        descAr: 'تضع جمعية روح الفنون والثقافة رهن إشارة ممثلي وسائل الإعلام ملفاً صحفياً متكاملاً.',
        primaryBtnTextAr: 'تواصل مع الخلية الإعلامية',
        primaryBtnUrl: '/contact',
        secondaryBtnTextAr: 'اقتراح تغطية أو شراكة إعلامية',
        secondaryBtnUrl: '/partnerships',
      },
    }
    const result = newsPageConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.stats.length, 2)
      assert.equal(result.data.hero.tagAr, 'المركز الإعلامي والبيانات الرسمية')
    }
  })

  test('rejects news configuration with missing required fields or empty stats', () => {
    const invalid = {
      hero: {
        tagAr: '',
        tagFr: '',
        tagEn: '',
        badgeAr: '',
        titleAr: 'أ',
        titleFr: 'a',
        titleEn: 'b',
        subtitleAr: 'c',
        subtitleFr: 'd',
        subtitleEn: 'e',
        descriptionAr: 'قصير',
        descriptionFr: 'court',
        descriptionEn: 'short',
        imageUrl: '',
        hasHeroImage: false,
      },
      stats: [],
      cta: {
        badgeAr: '',
        titleAr: '',
        descAr: '',
        primaryBtnTextAr: '',
        primaryBtnUrl: '',
        secondaryBtnTextAr: '',
        secondaryBtnUrl: '',
      },
    }
    const result = newsPageConfigSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})


// ============================================================
// PARTNERSHIPS VALIDATION SUITE
// ============================================================

const partnershipSubmissionSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required').max(150),
  organizationType: z.string().min(2, 'Organization type is required'),
  contactName: z.string().min(3, 'Contact person name is required').max(100),
  email: z.string().email('Please enter a valid professional email'),
  phone: z.string().max(20).optional(),
  city: z.string().min(2, 'City is required').max(50),
  country: z.string().default('Morocco'),
  proposal: z.string().min(20, 'Please describe your partnership proposal').max(2000),
})

const partnerItemSchema = z.object({
  id: z.string().min(1),
  nameAr: z.string().min(1),
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  tier: z.enum(['institutional', 'cultural', 'educational', 'civil_society', 'sponsor']),
  logoUrl: z.string(),
  websiteUrl: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionFr: z.string().optional(),
  descriptionEn: z.string().optional(),
  active: z.boolean().default(true),
  order: z.number().optional(),
})

const partnershipsPageConfigSchema = z.object({
  hero: z.object({
    tagAr: z.string().min(1),
    tagFr: z.string().min(1),
    tagEn: z.string().min(1),
    badgeAr: z.string().min(1),
    badgeFr: z.string().min(1),
    badgeEn: z.string().min(1),
    titleAr: z.string().min(3),
    titleFr: z.string().min(3),
    titleEn: z.string().min(3),
    subtitleAr: z.string().min(3),
    subtitleFr: z.string().min(3),
    subtitleEn: z.string().min(3),
    descriptionAr: z.string().min(10),
    descriptionFr: z.string().min(10),
    descriptionEn: z.string().min(10),
    imageUrl: z.string().optional().default(''),
    hasHeroImage: z.boolean().default(false),
    primaryBtnTextAr: z.string().min(1),
    primaryBtnTextFr: z.string().min(1),
    primaryBtnTextEn: z.string().min(1),
    primaryBtnUrl: z.string().min(1),
    brochureBtnTextAr: z.string().min(1),
    brochureBtnTextFr: z.string().min(1),
    brochureBtnTextEn: z.string().min(1),
    brochureUrl: z.string().optional().default(''),
  }),
  stats: z.array(
    z.object({
      id: z.string(),
      value: z.string().min(1),
      valueAr: z.string().optional(),
      valueFr: z.string().optional(),
      valueEn: z.string().optional(),
      labelAr: z.string().min(1),
      labelFr: z.string().min(1),
      labelEn: z.string().min(1),
      icon: z.string().min(1),
    })
  ).min(1),
  pillars: z.array(
    z.object({
      id: z.string(),
      icon: z.string(),
      titleAr: z.string().min(1),
      titleFr: z.string().min(1),
      titleEn: z.string().min(1),
      descriptionAr: z.string().min(1),
      descriptionFr: z.string().min(1),
      descriptionEn: z.string().min(1),
      tagAr: z.string().min(1),
      tagFr: z.string().min(1),
      tagEn: z.string().min(1),
    })
  ).min(1),
  benefits: z.array(
    z.object({
      id: z.string(),
      icon: z.string(),
      titleAr: z.string().min(1),
      titleFr: z.string().min(1),
      titleEn: z.string().min(1),
      descriptionAr: z.string().min(1),
      descriptionFr: z.string().min(1),
      descriptionEn: z.string().min(1),
    })
  ).min(1),
  partners: z.array(partnerItemSchema),
  cta: z.object({
    badgeAr: z.string().min(1),
    badgeFr: z.string().min(1),
    badgeEn: z.string().min(1),
    titleAr: z.string().min(1),
    titleFr: z.string().min(1),
    titleEn: z.string().min(1),
    descriptionAr: z.string().min(1),
    descriptionFr: z.string().min(1),
    descriptionEn: z.string().min(1),
    primaryBtnTextAr: z.string().min(1),
    primaryBtnTextFr: z.string().min(1),
    primaryBtnTextEn: z.string().min(1),
    primaryBtnUrl: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
  }),
})

describe('Partnership Submission Validation Suite', () => {
  test('accepts valid partnership inquiry proposal', () => {
    const valid = {
      organizationName: 'Institut Français de Rabat',
      organizationType: 'cultural_center',
      contactName: 'Nadia Benmoussa',
      email: 'nadia.benmoussa@example.com',
      phone: '+212661000000',
      city: 'Rabat',
      country: 'Morocco',
      proposal: 'We would like to co-produce a series of youth theater workshops and cross-residences for visual artists.',
    }
    const result = partnershipSubmissionSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.city, 'Rabat')
    }
  })

  test('rejects partnership inquiry with invalid email and short proposal', () => {
    const invalid = {
      organizationName: 'Institut',
      organizationType: 'cultural_center',
      contactName: 'Nadia',
      email: 'not-valid-email',
      city: 'Rabat',
      proposal: 'Too short',
    }
    const result = partnershipSubmissionSchema.safeParse(invalid)
    assert.equal(result.success, false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      assert.ok(errors.email)
      assert.ok(errors.proposal)
    }
  })
})

describe('Partnerships Page Config & Directory Validation Suite', () => {
  test('accepts valid trilingual partnerships configuration with partner directory', () => {
    const valid = {
      hero: {
        tagAr: 'التعاون المؤسساتي والشراكات',
        tagFr: 'Coopération & Partenariats',
        tagEn: 'Institutional Cooperation & Alliances',
        badgeAr: 'بناء جسور العمل الثقافي المشترك',
        badgeFr: 'Bâtir des synergies culturelles durables',
        badgeEn: 'Building Sustainable Cultural Alliances',
        titleAr: 'شراكات استراتيجية لتمكين الشباب وصون التراث المغربي',
        titleFr: 'Des Partenariats Stratégiques au Service de la Création',
        titleEn: 'Strategic Alliances for Youth Empowerment & Heritage',
        subtitleAr: 'نعمل جنباً إلى جنب مع المراكز الثقافية والجامعات لتوسيع أثر العمل الفني.',
        subtitleFr: 'En collaboration étroite avec les centres culturels et universités.',
        subtitleEn: 'Collaborating hand-in-hand with cultural venues and academia.',
        descriptionAr: 'تؤمن جمعية روح الفنون والثقافة بأن التنمية الثقافية المستدامة تقوم على التحالفات التشاركية والتنسيق الميداني الفعال.',
        descriptionFr: 'L’AMYCC s’engage à développer des partenariats vertueux fondés sur la co-création.',
        descriptionEn: 'AMYCC believes that sustainable cultural development is founded on participatory alliances.',
        imageUrl: '',
        hasHeroImage: false,
        primaryBtnTextAr: 'تقديم مقترح شراكة',
        primaryBtnTextFr: 'Proposer un partenariat',
        primaryBtnTextEn: 'Submit Proposal',
        primaryBtnUrl: '#proposal-form',
        brochureBtnTextAr: 'تحميل ملف الشراكات',
        brochureBtnTextFr: 'Télécharger la brochure',
        brochureBtnTextEn: 'Download Brochure',
        brochureUrl: '',
      },
      stats: [
        { id: 'stat-partners', value: '+40', labelAr: 'شريك استراتيجي ومؤسساتي', labelFr: 'Partenaires actifs', labelEn: 'Active Partners', icon: '🏛️' },
        { id: 'stat-projects', value: '85+', labelAr: 'مشروع ومبادرة مشتركة', labelFr: 'Projets conjoints', labelEn: 'Joint Projects', icon: '🤝' },
      ],
      pillars: [
        {
          id: 'pillar-1',
          icon: '🏛️',
          titleAr: 'البرمجة الثقافية والإنتاج الفني المشترك',
          titleFr: 'Co-programmation culturelle',
          titleEn: 'Joint Cultural Curation',
          descriptionAr: 'تصميم وتنفيذ مهرجانات ومعارض تشكيلية مشتركة.',
          descriptionFr: 'Conception et production conjointe d’événements et festivals.',
          descriptionEn: 'Co-curating art exhibitions, festivals, and concerts.',
          tagAr: 'برمجة مشتركة',
          tagFr: 'Co-curation',
          tagEn: 'Joint Curation',
        },
      ],
      benefits: [
        {
          id: 'benefit-1',
          icon: '🤝',
          titleAr: 'أثر مجتمعي واسع ومباشر',
          titleFr: 'Impact citoyen démultiplié',
          titleEn: 'Direct Community Impact',
          descriptionAr: 'الوصول المباشر إلى آلاف المستفيدين من الشباب والمبدعين عبر جهات المملكة.',
          descriptionFr: 'Accès direct à des milliers de jeunes créateurs à travers le Royaume.',
          descriptionEn: 'Direct access to thousands of young creators across Morocco.',
        },
      ],
      partners: [
        {
          id: 'p-1',
          nameAr: 'المعهد العالي للفن المسرحي والتنشيط الثقافي',
          nameFr: 'ISADAC - Rabat',
          nameEn: 'Higher Institute of Theatrical Arts',
          tier: 'educational',
          logoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80',
          websiteUrl: 'https://isadac.ac.ma',
          active: true,
          order: 1,
        },
        {
          id: 'p-2',
          nameAr: 'مؤسسة الثقافات والفنون المعاصرة',
          nameFr: 'Fondation des Cultures & Arts',
          nameEn: 'Contemporary Arts Foundation',
          tier: 'cultural',
          logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80',
          active: true,
          order: 2,
        },
      ],
      cta: {
        badgeAr: 'التواصل المؤسساتي المباشر',
        badgeFr: 'Contact Institutionnel',
        badgeEn: 'Institutional Contact',
        titleAr: 'هل تمثل مؤسسة وترغب في بحث آفاق تعاون رسمي؟',
        titleFr: 'Vous représentez une institution souhaitant collaborer ?',
        titleEn: 'Representing an institution seeking formal alliance?',
        descriptionAr: 'يسعد قطب الشراكات والعلاقات المؤسساتية في جمعية روح الفنون والثقافة دراسة مقترحاتكم.',
        descriptionFr: 'Le pôle partenariats de l’AMYCC est à votre écoute.',
        descriptionEn: 'Our alliances desk is available to discuss collaboration initiatives.',
        primaryBtnTextAr: 'تواصل معنا',
        primaryBtnTextFr: 'Contactez-nous',
        primaryBtnTextEn: 'Contact Us',
        primaryBtnUrl: 'mailto:contact@amycc.org',
        email: 'contact@amycc.org',
        phone: '+212 5 37 00 00 00',
      },
    }

    const result = partnershipsPageConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.partners.length, 2)
      assert.equal(result.data.partners[0].tier, 'educational')
      assert.equal(result.data.stats[0].value, '+40')
    }
  })

  test('rejects partner with invalid tier enum', () => {
    const invalidPartner = {
      id: 'p-test',
      nameAr: 'جمعية تجريبية',
      nameFr: 'Assoc Test',
      nameEn: 'Test Assoc',
      tier: 'unsupported_tier',
      logoUrl: '',
    }
    const result = partnerItemSchema.safeParse(invalidPartner)
    assert.equal(result.success, false)
  })
})

const membershipTierSchema = z.object({
  id: z.string(),
  nameAr: z.string().min(1),
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  badgeAr: z.string().optional(),
  badgeFr: z.string().optional(),
  badgeEn: z.string().optional(),
  feeAr: z.string().min(1),
  feeFr: z.string().min(1),
  feeEn: z.string().min(1),
  periodAr: z.string().min(1),
  periodFr: z.string().min(1),
  periodEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  descriptionFr: z.string().min(1),
  descriptionEn: z.string().min(1),
  benefitsAr: z.array(z.string()).default([]),
  benefitsFr: z.array(z.string()).default([]),
  benefitsEn: z.array(z.string()).default([]),
  recommended: z.boolean().optional(),
  active: z.boolean().default(true),
  order: z.number().optional(),
})

const membershipPageConfigSchema = z.object({
  hero: z.object({
    tagAr: z.string(),
    tagFr: z.string(),
    tagEn: z.string(),
    badgeAr: z.string(),
    badgeFr: z.string(),
    badgeEn: z.string(),
    titleAr: z.string(),
    titleFr: z.string(),
    titleEn: z.string(),
    subtitleAr: z.string(),
    subtitleFr: z.string(),
    subtitleEn: z.string(),
    descriptionAr: z.string(),
    descriptionFr: z.string(),
    descriptionEn: z.string(),
    imageUrl: z.string(),
    hasHeroImage: z.boolean().default(true),
    primaryBtnTextAr: z.string(),
    primaryBtnTextFr: z.string(),
    primaryBtnTextEn: z.string(),
    primaryBtnUrl: z.string(),
    secondaryBtnTextAr: z.string(),
    secondaryBtnTextFr: z.string(),
    secondaryBtnTextEn: z.string(),
    secondaryBtnUrl: z.string(),
  }),
  stats: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
      labelAr: z.string(),
      labelFr: z.string(),
      labelEn: z.string(),
      icon: z.string(),
    })
  ),
  tiers: z.array(membershipTierSchema),
  benefits: z.array(
    z.object({
      id: z.string(),
      titleAr: z.string(),
      titleFr: z.string(),
      titleEn: z.string(),
      descriptionAr: z.string(),
      descriptionFr: z.string(),
      descriptionEn: z.string(),
      icon: z.string(),
    })
  ),
  steps: z.array(
    z.object({
      id: z.string(),
      titleAr: z.string(),
      titleFr: z.string(),
      titleEn: z.string(),
      descriptionAr: z.string(),
      descriptionFr: z.string(),
      descriptionEn: z.string(),
    })
  ),
  requirements: z.object({
    id: z.string(),
    titleAr: z.string(),
    titleFr: z.string(),
    titleEn: z.string(),
    itemsAr: z.array(z.string()),
    itemsFr: z.array(z.string()),
    itemsEn: z.array(z.string()),
  }),
  cta: z.object({
    badgeAr: z.string(),
    badgeFr: z.string(),
    badgeEn: z.string(),
    titleAr: z.string(),
    titleFr: z.string(),
    titleEn: z.string(),
    descriptionAr: z.string(),
    descriptionFr: z.string(),
    descriptionEn: z.string(),
    primaryBtnTextAr: z.string(),
    primaryBtnTextFr: z.string(),
    primaryBtnTextEn: z.string(),
    primaryBtnUrl: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
})

describe('Membership Page CMS Validation Suite', () => {
  test('accepts valid full membership page configuration', () => {
    const valid = {
      hero: {
        tagAr: 'بوابة الانخراط والمواطنة الثقافية',
        tagFr: "Portail d'Adhésion & Citoyenneté Culturelle",
        tagEn: 'Membership & Cultural Citizenship Portal',
        badgeAr: 'جمعية روح الفنون والثقافة — AMYCC',
        badgeFr: 'Association Spirit of Arts & Culture — AMYCC',
        badgeEn: 'Spirit of Arts & Culture Association — AMYCC',
        titleAr: 'انضم إلى أسرة روح الفنون والثقافة وكن شريكاً فاعلاً في صناعة المشهد الإبداعي المغربي',
        titleFr: 'Rejoignez la communauté AMYCC et participez activement à l’effervescence artistique marocaine',
        titleEn: 'Join the AMYCC Family and Become an Active Catalyst in Moroccan Cultural Expression',
        subtitleAr: 'عضوية نوعية تعزز حضورك الفني، تفتح لك أبواب التكوين المسرحي والورشات التراثية، وتمنحك حق المشاركة والقرار في مسار الجمعية.',
        subtitleFr: 'Une adhésion valorisante qui propulse vos talents et ouvre l’accès aux laboratoires de création.',
        subtitleEn: 'An empowering membership unlocking theatrical masterclasses and democratic voting rights.',
        descriptionAr: 'نؤمن في جمعية روح الفنون والثقافة أن العضوية ميثاق التزام مدني وإبداعي مشترك.',
        descriptionFr: 'Pour l’AMYCC, adhérer est un engagement citoyen et créatif fondé sur la réciprocité.',
        descriptionEn: 'At AMYCC, membership is an authentic partnership fostering creative solidarity.',
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        hasHeroImage: true,
        primaryBtnTextAr: 'تقديم طلب الانخراط الرسمي',
        primaryBtnTextFr: 'Déposer ma candidature d’adhésion',
        primaryBtnTextEn: 'Submit Membership Application',
        primaryBtnUrl: '#membership-form',
        secondaryBtnTextAr: 'استكشاف فئات وبطاقات العضوية',
        secondaryBtnTextFr: 'Découvrir les catégories d’adhésion',
        secondaryBtnTextEn: 'Explore Membership Tiers',
        secondaryBtnUrl: '#membership-tiers',
      },
      stats: [
        {
          id: 'stat-active-members',
          value: '+250',
          labelAr: 'عضواً فاعلاً ومتطوعاً منخرطاً',
          labelFr: 'Membres actifs et bénévoles',
          labelEn: 'Active Members & Volunteers',
          icon: '👥',
        },
      ],
      tiers: [
        {
          id: 'tier-active-practitioner',
          nameAr: 'عضو فاعل وممارس',
          nameFr: 'Membre Actif & Pratiquant',
          nameEn: 'Active Practicing Member',
          badgeAr: 'الفئة الأكثر تأثيراً ومشاركة',
          badgeFr: 'Catégorie phare de l’association',
          badgeEn: 'Core Association Membership',
          feeAr: '200 درهم',
          feeFr: '200 MAD',
          feeEn: '200 MAD',
          periodAr: 'سنوياً',
          periodFr: 'Par an',
          periodEn: 'Annual',
          descriptionAr: 'مخصصة للفنانين والممارسين الثقافيين والفاعلين الجمعويين.',
          descriptionFr: 'Destinée aux créateurs et animateurs culturels.',
          descriptionEn: 'Tailored for artists and active cultural catalysts.',
          benefitsAr: ['بطاقة عضوية رسمية', 'حق التصويت بالجمع العام'],
          benefitsFr: ['Carte officielle', 'Droit de vote en AG'],
          benefitsEn: ['Official card', 'Voting rights at GA'],
          recommended: true,
          active: true,
          order: 1,
        },
      ],
      benefits: [
        {
          id: 'benefit-voting-rights',
          titleAr: 'حق المشاركة والتصويت بالجمع العام',
          titleFr: 'Droit de Vote en Assemblée Générale',
          titleEn: 'Democratic Voting Rights',
          descriptionAr: 'صوت مسموع في انتخاب المكتب التنفيذي.',
          descriptionFr: 'Participez aux décisions stratégiques.',
          descriptionEn: 'Exercise democratic voting power.',
          icon: '🗳️',
        },
      ],
      steps: [
        {
          id: 'step-1-form',
          titleAr: 'إيداع الاستمارة الرقمية',
          titleFr: 'Candidature Numérique',
          titleEn: 'Digital Application',
          descriptionAr: 'تعبئة استمارة الانخراط.',
          descriptionFr: 'Formulaire trilingue en ligne.',
          descriptionEn: 'Complete the online application.',
        },
      ],
      requirements: {
        id: 'requirements-bylaws',
        titleAr: 'شروط ومعايير الانخراط المعتمدة بالنظام الأساسي',
        titleFr: 'Conditions & Critères d’Adhésion Statutaires',
        titleEn: 'Statutory Membership Criteria & Bylaws',
        itemsAr: ['احترام النظام الأساسي والداخلي للجمعية'],
        itemsFr: ['Adhésion aux principes et statuts de l’AMYCC'],
        itemsEn: ['Compliance with AMYCC constitutional bylaws'],
      },
      cta: {
        badgeAr: 'قطب العضوية والانخراط',
        badgeFr: 'Pôle Adhésions & Vie Associative',
        badgeEn: 'Membership & Civic Engagement Desk',
        titleAr: 'هل لديك استفسار حول إجراءات أو فئات الانخراط؟',
        titleFr: 'Une question concernant votre adhésion ?',
        titleEn: 'Questions Regarding Membership Tiers?',
        descriptionAr: 'فريق قطب العضوية رهن إشارتكم لمواكبتكم.',
        descriptionFr: 'Notre équipe est à votre disposition.',
        descriptionEn: 'Our membership desk is available to assist you.',
        primaryBtnTextAr: 'راسلنا مباشرة',
        primaryBtnTextFr: 'Écrivez-nous',
        primaryBtnTextEn: 'Email Membership Desk',
        primaryBtnUrl: 'mailto:adhesion@amycc.org',
        email: 'adhesion@amycc.org',
        phone: '+212 5 37 00 00 00',
      },
    }

    const result = membershipPageConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.tiers.length, 1)
      assert.equal(result.data.tiers[0].recommended, true)
      assert.equal(result.data.stats[0].value, '+250')
    }
  })

  test('rejects tier with missing required fields', () => {
    const invalidTier = {
      id: 'tier-bad',
      nameAr: '',
      nameFr: 'Test',
      nameEn: 'Test',
      feeAr: '',
    }
    const result = membershipTierSchema.safeParse(invalidTier)
    assert.equal(result.success, false)
  })
})

const patronagePackageSchema = z.object({
  id: z.string(),
  nameAr: z.string().min(1),
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  badgeAr: z.string().optional(),
  badgeFr: z.string().optional(),
  badgeEn: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('MAD'),
  periodAr: z.string().min(1),
  periodFr: z.string().min(1),
  periodEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  descriptionFr: z.string().min(1),
  descriptionEn: z.string().min(1),
  impactAr: z.string().min(1),
  impactFr: z.string().min(1),
  impactEn: z.string().min(1),
  privilegesAr: z.array(z.string()).default([]),
  privilegesFr: z.array(z.string()).default([]),
  privilegesEn: z.array(z.string()).default([]),
  recommended: z.boolean().optional(),
  active: z.boolean().default(true),
  order: z.number().optional(),
})

const supportPageConfigSchema = z.object({
  hero: z.object({
    tagAr: z.string(),
    tagFr: z.string(),
    tagEn: z.string(),
    badgeAr: z.string(),
    badgeFr: z.string(),
    badgeEn: z.string(),
    titleAr: z.string(),
    titleFr: z.string(),
    titleEn: z.string(),
    subtitleAr: z.string(),
    subtitleFr: z.string(),
    subtitleEn: z.string(),
    descriptionAr: z.string(),
    descriptionFr: z.string(),
    descriptionEn: z.string(),
    imageUrl: z.string(),
    hasHeroImage: z.boolean().default(true),
    primaryBtnTextAr: z.string(),
    primaryBtnTextFr: z.string(),
    primaryBtnTextEn: z.string(),
    primaryBtnUrl: z.string(),
    secondaryBtnTextAr: z.string(),
    secondaryBtnTextFr: z.string(),
    secondaryBtnTextEn: z.string(),
    secondaryBtnUrl: z.string(),
  }),
  stats: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
      labelAr: z.string(),
      labelFr: z.string(),
      labelEn: z.string(),
      icon: z.string(),
    })
  ),
  paymentGateway: z.object({
    enabled: z.boolean(),
    provider: z.enum(['cmi', 'stripe', 'both']),
    mode: z.enum(['test', 'live']),
    cmiConfig: z.object({
      merchantId: z.string(),
      storeKey: z.string(),
      gatewayUrl: z.string(),
      okUrl: z.string(),
      failUrl: z.string(),
      callbackUrl: z.string(),
    }),
    stripeConfig: z.object({
      publishableKey: z.string(),
      secretKey: z.string(),
      webhookSecret: z.string(),
    }),
    presetAmounts: z.array(z.number()),
    currency: z.string(),
    allowCustomAmount: z.boolean(),
  }),
  bankTransfer: z.object({
    bankName: z.string(),
    accountHolder: z.string(),
    rib: z.string(),
    iban: z.string(),
    swift: z.string(),
    agency: z.string(),
    instructionsAr: z.string(),
    instructionsFr: z.string(),
    instructionsEn: z.string(),
  }),
  packages: z.array(patronagePackageSchema),
  pillars: z.array(
    z.object({
      id: z.string(),
      icon: z.string(),
      titleAr: z.string(),
      titleFr: z.string(),
      titleEn: z.string(),
      descriptionAr: z.string(),
      descriptionFr: z.string(),
      descriptionEn: z.string(),
    })
  ),
  transparencyFaqs: z.array(
    z.object({
      id: z.string(),
      questionAr: z.string(),
      questionFr: z.string(),
      questionEn: z.string(),
      answerAr: z.string(),
      answerFr: z.string(),
      answerEn: z.string(),
    })
  ),
  cta: z.object({
    badgeAr: z.string(),
    badgeFr: z.string(),
    badgeEn: z.string(),
    titleAr: z.string(),
    titleFr: z.string(),
    titleEn: z.string(),
    descriptionAr: z.string(),
    descriptionFr: z.string(),
    descriptionEn: z.string(),
    primaryBtnTextAr: z.string(),
    primaryBtnTextFr: z.string(),
    primaryBtnTextEn: z.string(),
    primaryBtnUrl: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
})

describe('Support & Payment Gateway Validation Suite', () => {
  test('accepts valid full support page configuration with CMI gateway', () => {
    const valid = {
      hero: {
        tagAr: 'بوابة الدعم والرعاية الثقافية والمجتمعية',
        tagFr: 'Portail de Mécénat & Soutien Culturel',
        tagEn: 'Patronage & Cultural Giving Portal',
        badgeAr: 'جمعية روح الفنون والثقافة — AMYCC',
        badgeFr: 'Association Esprit des Arts et de la Culture — AMYCC',
        badgeEn: 'Spirit of Arts & Culture Association — AMYCC',
        titleAr: 'ساهم في رعاية الإبداع وصناعة الأمل الثقافي للأجيال الصاعدة بالمغرب',
        titleFr: 'Participez au mécénat artistique et soutenez l’émergence culturelle au Maroc',
        titleEn: 'Catalyze Cultural Expression and Support Emerging Creative Talents Across Morocco',
        subtitleAr: 'كل درهم تقدمه يُمكّن طفلاً من ولوج ورشة مسرحية.',
        subtitleFr: 'Chaque contribution finance un atelier artistique gratuit.',
        subtitleEn: 'Every contribution funds free youth workshops.',
        descriptionAr: 'تعتمد جمعية روح الفنون والثقافة نموذجاً تشاركياً في التمويل.',
        descriptionFr: 'L’AMYCC applique une politique stricte de transparence.',
        descriptionEn: 'AMYCC operates with full financial integrity and civic commitment.',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        hasHeroImage: true,
        primaryBtnTextAr: 'المساهمة الفورية عبر البطاقة',
        primaryBtnTextFr: 'Don Sécurisé en Ligne',
        primaryBtnTextEn: 'Donate Securely Online',
        primaryBtnUrl: '#online-donation',
        secondaryBtnTextAr: 'التحويل البنكي المباشر (RIB)',
        secondaryBtnTextFr: 'Virement Bancaire (RIB)',
        secondaryBtnTextEn: 'Bank Transfer (RIB)',
        secondaryBtnUrl: '#bank-transfer',
      },
      stats: [
        {
          id: 'stat-impact-ratio',
          value: '100%',
          labelAr: 'توجيه مباشر لدعم برامج الميدان والشباب',
          labelFr: 'Des fonds alloués directement aux projets de terrain',
          labelEn: 'Allocated directly to field artistic initiatives',
          icon: '🎯',
        },
      ],
      paymentGateway: {
        enabled: true,
        provider: 'cmi',
        mode: 'test',
        cmiConfig: {
          merchantId: '600000000',
          storeKey: 'AMYCC_CMI_STORE_KEY_SANDBOX',
          gatewayUrl: 'https://testpayment.cmi.co.ma/fim/est3Dgate',
          okUrl: '/support/cmi-success',
          failUrl: '/support/cmi-failed',
          callbackUrl: '/api/donations/cmi-callback',
        },
        stripeConfig: {
          publishableKey: '',
          secretKey: '',
          webhookSecret: '',
        },
        presetAmounts: [100, 250, 500, 1000, 2500],
        currency: 'MAD',
        allowCustomAmount: true,
      },
      bankTransfer: {
        bankName: 'التجاري وفا بنك (Attijariwafa Bank)',
        accountHolder: 'جمعية روح الفنون والثقافة (AMYCC)',
        rib: '007 810 0001234567890123 45',
        iban: 'MA64 0078 1000 0123 4567 8901 2345',
        swift: 'BCMAMAMC',
        agency: 'وكالة الرباط أكدال — Avenue de France',
        instructionsAr: 'يرجى الإشارة إلى "مساهمة ثقافية" في خانة الموضوع.',
        instructionsFr: 'Mentionner Don Culturel comme motif.',
        instructionsEn: 'Mention Cultural Donation as reference.',
      },
      packages: [
        {
          id: 'package-workshop-sponsor',
          nameAr: 'راعي محترفات التكوين ومسرح الشباب',
          nameFr: 'Parrain des Ateliers Théâtre & Jeunesse',
          nameEn: 'Youth Theatre & Stage Workshops Patron',
          badgeAr: 'رعاية الأثر الميداني المباشر',
          badgeFr: 'Impact direct sur le terrain',
          badgeEn: 'Direct Educational Impact',
          amount: 5000,
          currency: 'MAD',
          periodAr: 'دورة تدريبية متكاملة',
          periodFr: 'Session complète de formation',
          periodEn: 'Full Workshop Cycle',
          descriptionAr: 'تغطية تكاليف التأطير الركحي والمستلزمات الفنية.',
          descriptionFr: 'Prise en charge de l’encadrement professionnel.',
          descriptionEn: 'Covering professional coaching and stage material.',
          impactAr: 'إنتاج عرض مسرحي ختامي متكامل يُعرض مجاناً.',
          impactFr: 'Restitution publique ouverte et certifiée.',
          impactEn: 'Staging an open public theatre performance.',
          privilegesAr: ['إدراج شكر شرفي وشعار الراعي'],
          privilegesFr: ['Mention d’honneur et logo'],
          privilegesEn: ['Honorary acknowledgment and logo'],
          recommended: false,
          active: true,
          order: 1,
        },
      ],
      pillars: [
        {
          id: 'pillar-theatre-youth',
          icon: '🎭',
          titleAr: 'المسرح وفنون الأداء للشباب',
          titleFr: 'Théâtre et Expression Scénique',
          titleEn: 'Youth Theatre & Stage Performance',
          descriptionAr: 'تمكين الشباب الموهوبين في الأوساط الشبه حضرية.',
          descriptionFr: 'Accompagnement des jeunes talents.',
          descriptionEn: 'Empowering emerging talents.',
        },
      ],
      transparencyFaqs: [
        {
          id: 'faq-legal-status',
          questionAr: 'ما هو الإطار القانوني لجمعية روح الفنون والثقافة؟',
          questionFr: 'Quel est le statut juridique de l’AMYCC ?',
          questionEn: 'What is AMYCC’s legal status?',
          answerAr: 'جمعية مدنية غير ربحية مؤسسة طبقاً للظهير الشريف 1958.',
          answerFr: 'Association marocaine à but non lucratif (Dahir 1958).',
          answerEn: 'Registered Moroccan non-profit association (Dahir 1958).',
        },
      ],
      cta: {
        badgeAr: 'قطب الرعاية وتنمية الموارد',
        badgeFr: 'Pôle Mécénat & Philanthropie',
        badgeEn: 'Patronage & Resource Development Desk',
        titleAr: 'هل ترغب في مناقشة برنامج رعاية مؤسساتي مخصص؟',
        titleFr: 'Vous souhaitez concevoir un programme de mécénat ?',
        titleEn: 'Seeking a Customized Corporate Patronage Program?',
        descriptionAr: 'يسعد مكتب الجمعية استقبال ممثلي الهيئات والشركات الراعية.',
        descriptionFr: 'Le bureau de l’AMYCC est à votre disposition.',
        descriptionEn: 'The AMYCC resource development committee is available.',
        primaryBtnTextAr: 'تواصل مع قطب الرعاية',
        primaryBtnTextFr: 'Contacter le Pôle Mécénat',
        primaryBtnTextEn: 'Contact Patronage Desk',
        primaryBtnUrl: 'mailto:mecenat@amycc.org',
        email: 'mecenat@amycc.org',
        phone: '+212 5 37 00 00 00',
      },
    }

    const result = supportPageConfigSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.packages.length, 1)
      assert.equal(result.data.paymentGateway.provider, 'cmi')
      assert.equal(result.data.paymentGateway.cmiConfig.merchantId, '600000000')
      assert.equal(result.data.bankTransfer.rib, '007 810 0001234567890123 45')
    }
  })

  test('rejects package with negative or zero amount', () => {
    const invalidPkg = {
      id: 'pkg-bad',
      nameAr: 'باقة غير صالحة',
      nameFr: 'Invalid',
      nameEn: 'Invalid',
      amount: -100,
      periodAr: 'سنة',
      periodFr: 'An',
      periodEn: 'Year',
      descriptionAr: 'وصف',
      descriptionFr: 'Desc',
      descriptionEn: 'Desc',
      impactAr: 'أثر',
      impactFr: 'Impact',
      impactEn: 'Impact',
    }
    const result = patronagePackageSchema.safeParse(invalidPkg)
    assert.equal(result.success, false)
  })
})
