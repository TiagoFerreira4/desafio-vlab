import type { FastifyReply, FastifyRequest } from "fastify";

import type { DeleteLessonUseCase } from "../../application/use-cases/delete-lesson.use-case.js";
import type { LessonParamsInput } from "../schemas/lesson.schema.js";

type DeleteLessonRequest = FastifyRequest<{
  Params: LessonParamsInput;
}>;

export function makeDeleteLessonController(useCase: DeleteLessonUseCase) {
  return async function deleteLessonController(
    request: DeleteLessonRequest,
    reply: FastifyReply,
  ) {
    await useCase.execute({
      courseId: request.params.courseId,
      lessonId: request.params.lessonId,
      userId: request.user.sub,
    });

    return reply.status(204).send();
  };
}
