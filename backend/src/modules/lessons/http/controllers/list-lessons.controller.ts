import type { FastifyReply, FastifyRequest } from "fastify";

import type { ListLessonsUseCase } from "../../application/use-cases/list-lessons.use-case.js";
import type { CourseLessonsParamsInput } from "../schemas/lesson.schema.js";

type ListLessonsRequest = FastifyRequest<{
  Params: CourseLessonsParamsInput;
}>;

export function makeListLessonsController(useCase: ListLessonsUseCase) {
  return async function listLessonsController(
    request: ListLessonsRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      courseId: request.params.courseId,
      userId: request.user.sub,
    });

    return reply.send(result);
  };
}
