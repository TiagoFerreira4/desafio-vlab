import type { FastifyReply, FastifyRequest } from "fastify";

import type { CreateLessonUseCase } from "../../application/use-cases/create-lesson.use-case.js";
import type {
  CourseLessonsParamsInput,
  LessonBodyInput,
} from "../schemas/lesson.schema.js";

type CreateLessonRequest = FastifyRequest<{
  Params: CourseLessonsParamsInput;
  Body: LessonBodyInput;
}>;

export function makeCreateLessonController(useCase: CreateLessonUseCase) {
  return async function createLessonController(
    request: CreateLessonRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      courseId: request.params.courseId,
      ...request.body,
      userId: request.user.sub,
    });

    return reply.status(201).send(result);
  };
}
