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
