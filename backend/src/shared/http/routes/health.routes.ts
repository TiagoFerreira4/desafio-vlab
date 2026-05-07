import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../infra/prisma/prisma.service.js";

const healthResponseSchema = z.object({
  status: z.literal("ok"),
  database: z.literal("up"),
});

export async function healthRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/health",
    {
      schema: {
        response: {
          200: healthResponseSchema,
        },
      },
    },
    async () => {
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: "ok",
        database: "up",
      } as const;
    },
  );
}
