import type { FastifyReply, FastifyRequest } from "fastify";

import type { ListCoursesUseCase } from "../../application/use-cases/list-courses.use-case.js";
import type { ListCoursesQueryInput } from "../schemas/list-courses.schema.js";

type ListCoursesRequest = FastifyRequest<{
  Querystring: ListCoursesQueryInput;
}>;

export function makeListCoursesController(useCase: ListCoursesUseCase) {
  return async function listCoursesController(
    request: ListCoursesRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      creatorId: request.user.sub,
      search: request.query.search,
    });

    return reply.send(result);
  };
}
