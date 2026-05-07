import type { FastifyInstance } from "fastify";

import { healthRoutes } from "../shared/http/routes/health.routes.js";

export async function registerAppRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);

  app.get("/", async () => {
    return {
      service: "backend",
      status: "running",
    };
  });
}
