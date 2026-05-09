import { z } from "zod";

import { authResponseSchema } from "./auth-user.schema.js";

export const registerBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerRouteSchema = {
  body: registerBodySchema,
  response: {
    201: authResponseSchema,
  },
};
