import { z } from 'zod';

export const volunteerOnboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  avatarUrl: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State or Province is required'),
  country: z.string().min(2, 'Country is required'),
  shortBio: z.string().min(15, 'Please provide a brief bio (at least 15 characters)'),
  causes: z.array(z.string()).min(1, 'Please select at least one cause'),
  skills: z.array(z.string()).min(1, 'Please select or add at least one skill'),
  availableDays: z.array(z.string()).min(1, 'Select at least one available day'),
  availableTimes: z.array(z.string()).min(1, 'Select at least one available time slot'),
  frequency: z.string().min(1, 'Please select your preferred volunteering frequency'),
  volunteeringPreference: z.enum(['ON_SITE', 'REMOTE', 'HYBRID']),
  languages: z.array(z.string()).min(1, 'Specify at least one language'),
  previousExperience: z.string().optional(),
  companyName: z.string().optional(),
});

export type VolunteerOnboardingFormData = z.infer<typeof volunteerOnboardingSchema>;

export const ngoOnboardingSchema = z.object({
  ngoName: z.string().min(2, 'Organization name must be at least 2 characters'),
  logoUrl: z.string().optional(),
  mission: z.string().min(20, 'Mission statement must be at least 20 characters'),
  description: z.string().min(30, 'Organization overview must be at least 30 characters'),
  causes: z.array(z.string()).min(1, 'Select at least one primary cause area'),
  locations: z.array(z.string()).min(1, 'Specify at least one operating city/region'),
  website: z.string().optional(),
  contactEmail: z.string().email('Please enter a valid official contact email'),
  contactPhone: z.string().min(5, 'Valid contact phone number is required'),
  address: z.string().optional(),
  registrationNumber: z.string().min(2, 'Registration or tax exempt number is required'),
  taxId: z.string().optional(),
  yearEstablished: z.string().min(4, 'Valid year of establishment is required (e.g. 2018)'),
  countryOfRegistration: z.string().min(2, 'Country of registration is required'),
  repFullName: z.string().min(2, 'Authorized representative name is required'),
  repTitle: z.string().min(2, 'Representative title/designation is required'),
  repEmail: z.string().email('Representative email is required'),
  repPhone: z.string().optional(),
});

export type NgoOnboardingFormData = z.infer<typeof ngoOnboardingSchema>;

export const corporateOnboardingSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  logoUrl: z.string().optional(),
  description: z.string().min(25, 'Company & CSR overview must be at least 25 characters'),
  website: z.string().optional(),
  locations: z.array(z.string()).min(1, 'Specify at least one corporate location or headquarters'),
  csrFocusAreas: z.array(z.string()).min(1, 'Select at least one CSR focus cause'),
  csrEmail: z.string().email('CSR department contact email is required'),
  csrPhone: z.string().min(5, 'Contact phone number is required'),
  adminFullName: z.string().min(2, 'Authorized administrator full name is required'),
  adminTitle: z.string().min(2, 'Administrator executive title is required'),
  adminEmail: z.string().email('Administrator email is required'),
});

export type CorporateOnboardingFormData = z.infer<typeof corporateOnboardingSchema>;
