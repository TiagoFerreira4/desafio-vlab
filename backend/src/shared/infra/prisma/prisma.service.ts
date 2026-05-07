import { PrismaClient } from "@prisma/client";

import { env } from "../env/env.js";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
