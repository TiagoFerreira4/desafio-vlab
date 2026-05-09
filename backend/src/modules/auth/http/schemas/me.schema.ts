import { profileResponseSchema } from "./auth-user.schema.js";

export const meRouteSchema = {
  tags: ["Auth"],
  summary: "Get authenticated profile",
  description: "Returns the profile for the current JWT subject.",
  security: [{ bearerAuth: [] }],
  response: {
    200: profileResponseSchema,
  },
};
