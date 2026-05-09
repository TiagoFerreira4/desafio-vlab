import { z } from "zod";

export const publicUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const authResponseSchema = z.object({
  user: publicUserSchema,
  token: z.string(),
});

export const profileResponseSchema = z.object({
  user: publicUserSchema,
});
