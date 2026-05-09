import type { FastifyInstance } from "fastify";

import { authRoutes } from "../modules/auth/http/routes/auth.routes.js";
import { healthRoutes } from "../shared/http/routes/health.routes.js";

export async function registerAppRoutes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(healthRoutes);

  app.get("/", async () => {
    return {
      service: "backend",
      status: "running",
    };
  });
}
