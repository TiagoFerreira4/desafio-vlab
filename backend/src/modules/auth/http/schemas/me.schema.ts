import { profileResponseSchema } from "./auth-user.schema.js";

export const meRouteSchema = {
  response: {
    200: profileResponseSchema,
  },
};
