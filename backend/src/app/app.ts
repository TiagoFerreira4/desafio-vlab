import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { registerSwaggerDocs } from "../shared/http/docs/swagger.js";
import { registerErrorHandler } from "../shared/http/errors/error-handler.js";
import { env } from "../shared/infra/env/env.js";
import { registerAppRoutes } from "./routes.js";

const configuredCorsOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedDevelopmentOrigin(origin: string) {
  try {
    const url = new URL(origin);

    if (url.protocol !== "http:" || url.port !== "5173") {
      return false;
    }

    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname.startsWith("192.168.") ||
      url.hostname.startsWith("10.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(url.hostname)
    );
  } catch {
    return false;
  }
}

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyCors, {
    origin: (origin, callback) => {
      const isAllowed =
        !origin ||
        configuredCorsOrigins.includes(origin) ||
        (env.NODE_ENV === "development" && isAllowedDevelopmentOrigin(origin));

      callback(null, isAllowed);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  });

  await registerSwaggerDocs(app);

  registerErrorHandler(app);

  await registerAppRoutes(app);

  return app;
}
