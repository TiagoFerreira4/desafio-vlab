import { Prisma } from "@prisma/client";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

import { AppError } from "../../domain/errors/app-error.js";

const jwtErrorCodes = new Set([
  "FST_JWT_BAD_REQUEST",
  "FST_JWT_NO_AUTHORIZATION_IN_COOKIE",
  "FST_JWT_NO_AUTHORIZATION_IN_HEADER",
  "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED",
  "FST_JWT_AUTHORIZATION_TOKEN_INVALID",
  "FST_JWT_AUTHORIZATION_TOKEN_UNTRUSTED",
  "FST_JWT_AUTHORIZATION_TOKEN_UNSIGNED",
]);

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        message: "Validation error.",
        issues: error.validation.map((issue) => ({
          path: issue.instancePath.replace(/^\//, "").replaceAll("/", "."),
          message: issue.message,
        })),
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return reply.status(409).send({
        message: "Resource already exists.",
      });
    }

    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : undefined;

    if (errorCode && jwtErrorCodes.has(errorCode)) {
      return reply.status(401).send({
        message: "Unauthorized.",
      });
    }

    if (isResponseSerializationError(error)) {
      request.log.error(error);

      return reply.status(500).send({
        message: "Internal server error.",
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      message: "Internal server error.",
    });
  });
}
