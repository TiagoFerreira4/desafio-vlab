import { z } from "zod";

export const courseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  creatorId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const courseResponseSchema = z.object({
  course: courseSchema,
});

export const courseListResponseSchema = z.object({
  courses: z.array(courseSchema),
});

export const courseParamsSchema = z.object({
  id: z.string().min(1),
});

export const courseBodySchema = z.object({
  name: z.string().min(3),
  description: z.string().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export type CourseBodyInput = z.infer<typeof courseBodySchema>;
export type CourseParamsInput = z.infer<typeof courseParamsSchema>;
