import type { FastifyReply, FastifyRequest } from "fastify";

import type { CreateCourseUseCase } from "../../application/use-cases/create-course.use-case.js";
import type { CourseBodyInput } from "../schemas/course.schema.js";

type CreateCourseRequest = FastifyRequest<{
  Body: CourseBodyInput;
}>;

export function makeCreateCourseController(useCase: CreateCourseUseCase) {
  return async function createCourseController(
    request: CreateCourseRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      ...request.body,
      creatorId: request.user.sub,
    });

    return reply.status(201).send(result);
  };
}
