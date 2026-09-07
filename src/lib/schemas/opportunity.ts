import { z } from 'zod';

export const opportunityFormSchema = z.object({
  title: z.string().min(3, 'Opportunity title must be at least 3 characters'),
  cause: z.string().min(1, 'Please select a primary cause area'),
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  responsibilities: z.array(z.string()).min(1, 'Please specify at least one volunteer responsibility'),
  requiredSkills: z.array(z.string()).min(1, 'Specify at least one required skill'),
  preferredExperience: z.string().optional(),
  location: z.string().min(2, 'Location or meeting address is required'),
  date: z.string().min(1, 'Service date is required'),
  startTime: z.string().min(1, 'Start time is required (e.g. 09:00 AM)'),
  endTime: z.string().min(1, 'End time is required (e.g. 01:00 PM)'),
  duration: z.string().min(1, 'Duration is required (e.g. 4 Hours)'),
  volunteerCapacity: z.number().min(1, 'Volunteer capacity must be at least 1'),
  applicationDeadline: z.string().min(1, 'Application deadline is required'),
  eligibilityRequirements: z.string().optional(),
  volunteeringMode: z.enum(['ON_SITE', 'REMOTE', 'HYBRID']),
  applicationQuestions: z.array(z.string()),
  visibility: z.enum(['PUBLIC', 'VOLUNTEER_ONLY', 'CORPORATE_ONLY']),
  isPublished: z.boolean(),
});

export type OpportunityFormData = z.infer<typeof opportunityFormSchema>;

// Legacy schema for backward-compatibility with early prototype pages
export const opportunitySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  cause: z.string().min(1, 'Please select a cause'),
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  skillsRequired: z.array(z.string()).min(1, 'Add at least one required skill'),
  location: z.string().min(2, 'Location is required'),
  isRemote: z.boolean().default(false),
  type: z.enum(['volunteering', 'mentorship', 'skills_based', 'csr_initiative']),
  status: z.enum(['open', 'in_review', 'closed', 'urgent']),
  startDate: z.string().min(1, 'Start date is required'),
  commitmentHours: z.string().min(1, 'Commitment hours is required'),
  capacityNeeded: z.coerce.number().min(1, 'Capacity needed must be at least 1'),
});

export const grantSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  focusArea: z.string().min(1, 'Please select a focus area'),
  budgetScope: z.string().min(1, 'Please select a budget range'),
  deadline: z.string().min(1, 'Please set a proposal deadline'),
  description: z.string().min(20, 'Please provide grant scope & criteria (at least 20 chars)'),
  eligibilityCriteria: z.string().min(10, 'Please describe eligibility requirements'),
});

export type GrantFormData = z.infer<typeof grantSchema>;
