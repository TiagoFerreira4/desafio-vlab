import type { FastifyInstance } from "fastify";

import { authRoutes } from "../modules/auth/http/routes/auth.routes.js";
import { courseRoutes } from "../modules/courses/http/routes/course.routes.js";
import { lessonRoutes } from "../modules/lessons/http/routes/lesson.routes.js";
import { healthRoutes } from "../shared/http/routes/health.routes.js";

export async function registerAppRoutes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(courseRoutes, { prefix: "/courses" });
  await app.register(lessonRoutes, { prefix: "/courses" });
  await app.register(healthRoutes);

  app.get("/", async () => {
    return {
      service: "backend",
      status: "running",
    };
  });
}
