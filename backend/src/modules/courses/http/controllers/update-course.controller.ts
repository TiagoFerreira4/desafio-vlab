import type { FastifyReply, FastifyRequest } from "fastify";

import type { UpdateCourseUseCase } from "../../application/use-cases/update-course.use-case.js";
import type {
  CourseBodyInput,
  CourseParamsInput,
} from "../schemas/course.schema.js";

type UpdateCourseRequest = FastifyRequest<{
  Params: CourseParamsInput;
  Body: CourseBodyInput;
}>;

export function makeUpdateCourseController(useCase: UpdateCourseUseCase) {
  return async function updateCourseController(
    request: UpdateCourseRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      id: request.params.id,
      ...request.body,
      userId: request.user.sub,
    });

    return reply.send(result);
  };
}
