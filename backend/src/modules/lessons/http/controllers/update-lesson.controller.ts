import type { FastifyReply, FastifyRequest } from "fastify";

import type { UpdateLessonUseCase } from "../../application/use-cases/update-lesson.use-case.js";
import type {
  LessonBodyInput,
  LessonParamsInput,
} from "../schemas/lesson.schema.js";

type UpdateLessonRequest = FastifyRequest<{
  Params: LessonParamsInput;
  Body: LessonBodyInput;
}>;

export function makeUpdateLessonController(useCase: UpdateLessonUseCase) {
  return async function updateLessonController(
    request: UpdateLessonRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      courseId: request.params.courseId,
      lessonId: request.params.lessonId,
      ...request.body,
      userId: request.user.sub,
    });

    return reply.send(result);
  };
}
