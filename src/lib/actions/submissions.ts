'use server'

import { createClient } from '@/lib/supabase/server'
import {
  membershipSchema,
  volunteerSchema,
  partnershipSchema,
  contactSchema,
  donationInquirySchema,
} from '@/lib/validation/schemas'

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function submitMembership(formData: FormData): Promise<ActionResponse> {
  try {
    const rawData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      profession: formData.get('profession') || undefined,
      interests: formData.getAll('interests'),
      motivation: formData.get('motivation'),
    }

    const validated = membershipSchema.safeParse(rawData)
    if (!validated.success) {
      return {
        success: false,
        message: 'Invalid submission data',
        errors: validated.error.flatten().fieldErrors,
      }
    }

    const supabase = await createClient()
    const { error } = await supabase.from('membership_applications').insert({
      full_name: validated.data.fullName,
      email: validated.data.email,
      phone: validated.data.phone,
      city: validated.data.city,
      profession: validated.data.profession,
      interests: validated.data.interests,
      motivation: validated.data.motivation,
      status: 'pending',
    })

    if (error) {
      return { success: false, message: 'Database error: ' + error.message }
    }

    return { success: true, message: 'Application submitted successfully.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'An unexpected error occurred.' }
  }
}

export async function submitVolunteer(formData: FormData): Promise<ActionResponse> {
  try {
    const rawData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      city: formData.get('city'),
      skills: formData.get('skills'),
      availability: formData.get('availability'),
      areasOfInterest: formData.getAll('areasOfInterest'),
      experience: formData.get('experience') || undefined,
      initiative: formData.get('initiative') || 'Youth in Action',
    }

    const validated = volunteerSchema.safeParse(rawData)
    if (!validated.success) {
      return {
        success: false,
        message: 'Invalid submission data',
        errors: validated.error.flatten().fieldErrors,
      }
    }

    const supabase = await createClient()
    const { error } = await supabase.from('volunteer_applications').insert({
      full_name: validated.data.fullName,
      email: validated.data.email,
      phone: validated.data.phone,
      city: validated.data.city,
      skills: validated.data.skills,
      availability: validated.data.availability,
      areas_of_interest: validated.data.areasOfInterest,
      experience: validated.data.experience,
      initiative: validated.data.initiative,
      status: 'pending',
    })

    if (error) {
      return { success: false, message: 'Database error: ' + error.message }
    }

    return { success: true, message: 'Volunteer application submitted successfully.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'An unexpected error occurred.' }
  }
}

export async function submitPartnership(formData: FormData): Promise<ActionResponse> {
  try {
    const rawData = {
      organizationName: formData.get('organizationName'),
      organizationType: formData.get('organizationType'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      city: formData.get('city'),
      country: formData.get('country') || 'Morocco',
      proposal: formData.get('proposal'),
    }

    const validated = partnershipSchema.safeParse(rawData)
    if (!validated.success) {
      return {
        success: false,
        message: 'Invalid submission data',
        errors: validated.error.flatten().fieldErrors,
      }
    }

    const supabase = await createClient()
    const { error } = await supabase.from('partnership_inquiries').insert({
      organization_name: validated.data.organizationName,
      organization_type: validated.data.organizationType,
      contact_name: validated.data.contactName,
      email: validated.data.email,
      phone: validated.data.phone,
      city: validated.data.city,
      country: validated.data.country,
      proposal: validated.data.proposal,
      status: 'pending',
    })

    if (error) {
      return { success: false, message: 'Database error: ' + error.message }
    }

    return { success: true, message: 'Partnership inquiry submitted successfully.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'An unexpected error occurred.' }
  }
}

export async function submitSupportInquiry(formData: FormData): Promise<ActionResponse> {
  try {
    const rawAmount = formData.get('amount')
    const rawData = {
      donorName: formData.get('donorName'),
      donorEmail: formData.get('donorEmail'),
      donorPhone: formData.get('donorPhone') || undefined,
      supportType: formData.get('supportType'),
      amount: rawAmount ? Number(rawAmount) : undefined,
      currency: formData.get('currency') || 'MAD',
      notes: formData.get('notes') || undefined,
    }

    const validated = donationInquirySchema.safeParse(rawData)
    if (!validated.success) {
      return {
        success: false,
        message: 'Invalid submission data',
        errors: validated.error.flatten().fieldErrors,
      }
    }

    const supabase = await createClient()
    const { error } = await supabase.from('donation_records').insert({
      donor_name: validated.data.donorName,
      donor_email: validated.data.donorEmail,
      donor_phone: validated.data.donorPhone,
      support_type: validated.data.supportType,
      amount: validated.data.amount,
      currency: validated.data.currency,
      notes: validated.data.notes,
      status: 'pending',
    })

    if (error) {
      return { success: false, message: 'Database error: ' + error.message }
    }

    return { success: true, message: 'Support inquiry recorded successfully.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'An unexpected error occurred.' }
  }
}
