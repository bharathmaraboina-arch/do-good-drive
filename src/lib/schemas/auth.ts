import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const chooseRoleSchema = z.object({
  role: z.enum(['volunteer', 'ngo', 'corporate']),
  organizationName: z.string().optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  location: z.string().min(2, 'Please specify your location or city'),
  causes: z.array(z.string()).min(1, 'Please select at least one primary cause or focus area'),
}).superRefine((data, ctx) => {
  if ((data.role === 'ngo' || data.role === 'corporate') && (!data.organizationName || data.organizationName.trim().length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Organization name is required for NGOs and Corporates',
      path: ['organizationName'],
    });
  }
});

export type ChooseRoleFormData = z.infer<typeof chooseRoleSchema>;
