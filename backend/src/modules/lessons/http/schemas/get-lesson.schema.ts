import { lessonParamsSchema, lessonResponseSchema } from "./lesson.schema.js";

export const getLessonRouteSchema = {
  tags: ["Lessons"],
  summary: "Get lesson",
  description: "Returns one lesson from a course owned by the authenticated user.",
  security: [{ bearerAuth: [] }],
  params: lessonParamsSchema,
  response: {
    200: lessonResponseSchema,
  },
};
