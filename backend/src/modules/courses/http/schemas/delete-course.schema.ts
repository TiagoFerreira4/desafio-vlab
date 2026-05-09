import { z } from "zod";

import { courseParamsSchema } from "./course.schema.js";

export const deleteCourseRouteSchema = {
  tags: ["Courses"],
  summary: "Delete course",
  description: "Deletes a course owned by the authenticated user.",
  security: [{ bearerAuth: [] }],
  params: courseParamsSchema,
  response: {
    204: z.undefined(),
  },
};
