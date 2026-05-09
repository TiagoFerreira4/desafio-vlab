import { z } from "zod";

import { courseListResponseSchema } from "./course.schema.js";

export const listCoursesQuerySchema = z.object({
  search: z.string().optional(),
});

export const listCoursesRouteSchema = {
  tags: ["Courses"],
  summary: "List my courses",
  description: "Lists courses created by the authenticated user, optionally filtered by course name.",
  security: [{ bearerAuth: [] }],
  querystring: listCoursesQuerySchema,
  response: {
    200: courseListResponseSchema,
  },
};

export type ListCoursesQueryInput = z.infer<typeof listCoursesQuerySchema>;
