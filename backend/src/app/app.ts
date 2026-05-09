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

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

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
