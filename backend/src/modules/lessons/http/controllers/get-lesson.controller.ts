import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetLessonUseCase } from "../../application/use-cases/get-lesson.use-case.js";
import type { LessonParamsInput } from "../schemas/lesson.schema.js";

type GetLessonRequest = FastifyRequest<{
  Params: LessonParamsInput;
}>;

export function makeGetLessonController(useCase: GetLessonUseCase) {
  return async function getLessonController(
    request: GetLessonRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      courseId: request.params.courseId,
      lessonId: request.params.lessonId,
      userId: request.user.sub,
    });

    return reply.send(result);
  };
}
