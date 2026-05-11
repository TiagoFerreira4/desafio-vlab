import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "./app.js";

describe("OpenAPI docs", () => {
  let app: FastifyInstance | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("exposes the OpenAPI spec in test environment", async () => {
    app = await buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/docs/json",
    });

    expect(response.statusCode).toBe(200);

    const spec = response.json<{
      paths: Record<string, unknown>;
      components?: {
        securitySchemes?: Record<string, unknown>;
      };
    }>();

    expect(spec.paths).toHaveProperty("/auth/register");
    expect(spec.paths).toHaveProperty("/auth/login");
    expect(spec.paths).toHaveProperty("/auth/me");
    expect(spec.paths).toHaveProperty("/courses/");
    expect(spec.paths).toHaveProperty("/courses/{courseId}/lessons/");
    expect(spec.paths).toHaveProperty("/courses/{courseId}/lessons/{lessonId}");
    expect(spec.components?.securitySchemes).toHaveProperty("bearerAuth");
  });
});
