import { z } from "zod";

import { authResponseSchema } from "./auth-user.schema.js";

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginRouteSchema = {
  tags: ["Auth"],
  summary: "Login",
  description: "Authenticates a user with email and password.",
  body: loginBodySchema,
  response: {
    200: authResponseSchema,
  },
};
