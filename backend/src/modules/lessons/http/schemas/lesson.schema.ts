import { z } from "zod";

export const lessonStatusSchema = z.enum(["draft", "published"]);

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: lessonStatusSchema,
  videoUrl: z.string().nullable(),
  courseId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const lessonResponseSchema = z.object({
  lesson: lessonSchema,
});

export const lessonListResponseSchema = z.object({
  lessons: z.array(lessonSchema),
});

export const lessonParamsSchema = z.object({
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
});

export const courseLessonsParamsSchema = z.object({
  courseId: z.string().min(1),
});

export const lessonBodySchema = z.object({
  title: z.string().min(3),
  status: lessonStatusSchema,
  videoUrl: z.string().url().optional().nullable(),
});

export type LessonBodyInput = z.infer<typeof lessonBodySchema>;
export type LessonParamsInput = z.infer<typeof lessonParamsSchema>;
export type CourseLessonsParamsInput = z.infer<
  typeof courseLessonsParamsSchema
>;
