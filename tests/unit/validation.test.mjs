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
