import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
} from "fastify-type-provider-zod";

import { env } from "../../infra/env/env.js";

export async function registerSwaggerDocs(app: FastifyInstance) {
  if (env.NODE_ENV === "production") {
    return;
  }

  await app.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "CourseSphere API",
        description: "API for authentication and online course management.",
        version: "1.0.0",
      },
      tags: [
        { name: "Auth", description: "Authentication and current user." },
        { name: "Courses", description: "Authenticated course management." },
        { name: "Lessons", description: "Authenticated lesson management." },
        { name: "Health", description: "Service health checks." },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });
}
