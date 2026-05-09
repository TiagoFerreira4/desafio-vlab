import { courseBodySchema, courseResponseSchema } from "./course.schema.js";

export const createCourseRouteSchema = {
  tags: ["Courses"],
  summary: "Create course",
  description: "Creates a course owned by the authenticated user.",
  security: [{ bearerAuth: [] }],
  body: courseBodySchema,
  response: {
    201: courseResponseSchema,
  },
};
