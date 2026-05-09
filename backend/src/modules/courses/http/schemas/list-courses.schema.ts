import { courseListResponseSchema } from "./course.schema.js";

export const listCoursesRouteSchema = {
  response: {
    200: courseListResponseSchema,
  },
};
