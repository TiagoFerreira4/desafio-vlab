import { courseListResponseSchema } from "./course.schema.js";

export const listCoursesRouteSchema = {
  tags: ["Courses"],
  summary: "List my courses",
  description: "Lists courses created by the authenticated user.",
  security: [{ bearerAuth: [] }],
  response: {
    200: courseListResponseSchema,
  },
};
