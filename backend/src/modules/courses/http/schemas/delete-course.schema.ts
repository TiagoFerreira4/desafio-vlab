import { z } from "zod";

import { courseParamsSchema } from "./course.schema.js";

export const deleteCourseRouteSchema = {
  params: courseParamsSchema,
  response: {
    204: z.undefined(),
  },
};
