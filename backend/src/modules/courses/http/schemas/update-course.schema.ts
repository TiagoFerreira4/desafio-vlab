import {
  courseBodySchema,
  courseParamsSchema,
  courseResponseSchema,
} from "./course.schema.js";

export const updateCourseRouteSchema = {
  params: courseParamsSchema,
  body: courseBodySchema,
  response: {
    200: courseResponseSchema,
  },
};
