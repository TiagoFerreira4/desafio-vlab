import {
  courseBodySchema,
  courseParamsSchema,
  courseResponseSchema,
} from "./course.schema.js";

export const updateCourseRouteSchema = {
  tags: ["Courses"],
  summary: "Update course",
  description: "Updates a course owned by the authenticated user.",
  security: [{ bearerAuth: [] }],
  params: courseParamsSchema,
  body: courseBodySchema,
  response: {
    200: courseResponseSchema,
  },
};
