import {
  courseLessonsParamsSchema,
  lessonBodySchema,
  lessonResponseSchema,
} from "./lesson.schema.js";

export const createLessonRouteSchema = {
  tags: ["Lessons"],
  summary: "Create lesson",
  description: "Creates a lesson in a course owned by the authenticated user.",
  security: [{ bearerAuth: [] }],
  params: courseLessonsParamsSchema,
  body: lessonBodySchema,
  response: {
    201: lessonResponseSchema,
  },
};
