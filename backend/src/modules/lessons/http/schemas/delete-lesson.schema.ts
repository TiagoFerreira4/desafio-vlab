import { z } from "zod";

import { lessonParamsSchema } from "./lesson.schema.js";

export const deleteLessonRouteSchema = {
  tags: ["Lessons"],
  summary: "Delete lesson",
  description: "Deletes a lesson from a course owned by the authenticated user.",
  security: [{ bearerAuth: [] }],
  params: lessonParamsSchema,
  response: {
    204: z.undefined(),
  },
};
