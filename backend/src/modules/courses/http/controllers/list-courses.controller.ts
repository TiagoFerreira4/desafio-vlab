import type { FastifyReply, FastifyRequest } from "fastify";

import type { ListCoursesUseCase } from "../../application/use-cases/list-courses.use-case.js";

export function makeListCoursesController(useCase: ListCoursesUseCase) {
  return async function listCoursesController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      creatorId: request.user.sub,
    });

    return reply.send(result);
  };
}
