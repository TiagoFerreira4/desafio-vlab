import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetCourseUseCase } from "../../application/use-cases/get-course.use-case.js";
import type { CourseParamsInput } from "../schemas/course.schema.js";

type GetCourseRequest = FastifyRequest<{
  Params: CourseParamsInput;
}>;

export function makeGetCourseController(useCase: GetCourseUseCase) {
  return async function getCourseController(
    request: GetCourseRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      id: request.params.id,
    });

    return reply.send(result);
  };
}
