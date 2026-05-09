import { courseParamsSchema, courseResponseSchema } from "./course.schema.js";

export const getCourseRouteSchema = {
  params: courseParamsSchema,
  response: {
    200: courseResponseSchema,
  },
};
