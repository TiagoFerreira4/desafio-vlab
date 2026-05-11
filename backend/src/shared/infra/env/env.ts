import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3333),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1).default("7d"),
  DATABASE_URL: z.url(),
});

export const env = envSchema.parse(process.env);
