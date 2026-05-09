import { z } from "zod";

import { authResponseSchema } from "./auth-user.schema.js";

export const registerBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerRouteSchema = {
  tags: ["Auth"],
  summary: "Register user",
  description: "Creates a user account and returns a JWT token.",
  body: registerBodySchema,
  response: {
    201: authResponseSchema,
  },
};
