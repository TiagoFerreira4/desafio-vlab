import {
  courseLessonsParamsSchema,
  lessonListResponseSchema,
} from "./lesson.schema.js";

export const listLessonsRouteSchema = {
  tags: ["Lessons"],
  summary: "List lessons",
  description: "Lists lessons from a course owned by the authenticated user.",
  security: [{ bearerAuth: [] }],
  params: courseLessonsParamsSchema,
  response: {
    200: lessonListResponseSchema,
  },
};
