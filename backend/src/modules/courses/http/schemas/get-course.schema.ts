import { courseParamsSchema, courseResponseSchema } from "./course.schema.js";

export const getCourseRouteSchema = {
  tags: ["Courses"],
  summary: "Get course",
  description: "Returns one course when it belongs to the authenticated user.",
  security: [{ bearerAuth: [] }],
  params: courseParamsSchema,
  response: {
    200: courseResponseSchema,
  },
};
