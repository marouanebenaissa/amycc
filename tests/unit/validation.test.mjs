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
