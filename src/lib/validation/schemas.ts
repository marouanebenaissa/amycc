import { z } from 'zod'

export const membershipSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits').max(20),
  city: z.string().min(2, 'City is required').max(50),
  profession: z.string().max(100).optional(),
  interests: z.array(z.string()).default([]),
  motivation: z.string().min(10, 'Please provide a brief motivation').max(1000),
})

export const volunteerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits').max(20).optional(),
  city: z.string().min(2, 'City is required').max(50),
  skills: z.string().min(3, 'Please describe your skills').max(500),
  availability: z.string().min(2, 'Please state your availability').max(100),
  areasOfInterest: z.array(z.string()).default([]),
  experience: z.string().max(1000).optional(),
  initiative: z.string().default('Youth in Action'),
})

export const partnershipSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required').max(150),
  organizationType: z.string().min(2, 'Organization type is required'),
  contactName: z.string().min(3, 'Contact person name is required').max(100),
  email: z.string().email('Please enter a valid professional email'),
  phone: z.string().max(20).optional(),
  city: z.string().min(2, 'City is required').max(50),
  country: z.string().default('Morocco'),
  proposal: z.string().min(20, 'Please describe your partnership proposal').max(2000),
})

export const contactSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(20).optional(),
  subject: z.string().max(150).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

export const donationInquirySchema = z.object({
  donorName: z.string().min(3, 'Name is required').max(100),
  donorEmail: z.string().email('Valid email is required'),
  donorPhone: z.string().max(20).optional(),
  supportType: z.enum(['financial', 'in_kind', 'sponsorship', 'equipment', 'venue']),
  amount: z.number().positive().optional(),
  currency: z.string().default('MAD'),
  notes: z.string().max(1000).optional(),
})

export const eventRegistrationSchema = z.object({
  eventId: z.string().uuid('Invalid event selection'),
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(20).optional(),
})
