import type { FastifyReply, FastifyRequest } from "fastify";

import type { DeleteCourseUseCase } from "../../application/use-cases/delete-course.use-case.js";
import type { CourseParamsInput } from "../schemas/course.schema.js";

type DeleteCourseRequest = FastifyRequest<{
  Params: CourseParamsInput;
}>;

export function makeDeleteCourseController(useCase: DeleteCourseUseCase) {
  return async function deleteCourseController(
    request: DeleteCourseRequest,
    reply: FastifyReply,
  ) {
    await useCase.execute({
      id: request.params.id,
      userId: request.user.sub,
    });

    return reply.status(204).send();
  };
}
