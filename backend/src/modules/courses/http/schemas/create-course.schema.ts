import { courseBodySchema, courseResponseSchema } from "./course.schema.js";

export const createCourseRouteSchema = {
  body: courseBodySchema,
  response: {
    201: courseResponseSchema,
  },
};
