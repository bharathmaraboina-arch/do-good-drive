import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  type: z.enum(['POST', 'IMPACT_STORY']),
  cause: z.string().min(2, 'Please select a cause'),
  body: z.string().min(20, 'Post body must be at least 20 characters'),
  imageUrl: z.string().optional(),
  impactMetric: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'VOLUNTEER_ONLY', 'CORPORATE_ONLY']),
  isPublished: z.boolean(),
});

export type PostFormData = z.infer<typeof postSchema>;
