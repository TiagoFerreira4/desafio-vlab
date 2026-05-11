import { z } from "zod";

import { courseListResponseSchema } from "./course.schema.js";

export const listCoursesQuerySchema = z.object({
  scope: z.enum(["mine", "all"]).default("mine"),
  search: z.string().optional(),
});

export const listCoursesRouteSchema = {
  tags: ["Courses"],
  summary: "List courses",
  description:
    "Lists courses by scope. The default scope lists courses created by the authenticated user; all lists every course in read-only catalog views.",
  security: [{ bearerAuth: [] }],
  querystring: listCoursesQuerySchema,
  response: {
    200: courseListResponseSchema,
  },
};

export type ListCoursesQueryInput = z.infer<typeof listCoursesQuerySchema>;
