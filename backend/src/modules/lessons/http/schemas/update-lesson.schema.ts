import {
  lessonBodySchema,
  lessonParamsSchema,
  lessonResponseSchema,
} from "./lesson.schema.js";

export const updateLessonRouteSchema = {
  tags: ["Lessons"],
  summary: "Update lesson",
  description: "Updates a lesson from a course owned by the authenticated user.",
  security: [{ bearerAuth: [] }],
  params: lessonParamsSchema,
  body: lessonBodySchema,
  response: {
    200: lessonResponseSchema,
  },
};
