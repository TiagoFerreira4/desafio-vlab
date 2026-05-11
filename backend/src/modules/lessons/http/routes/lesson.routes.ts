import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { PrismaCoursesRepository } from "../../../courses/infra/repositories/prisma-courses.repository.js";
import { CreateLessonUseCase } from "../../application/use-cases/create-lesson.use-case.js";
import { DeleteLessonUseCase } from "../../application/use-cases/delete-lesson.use-case.js";
import { GetLessonUseCase } from "../../application/use-cases/get-lesson.use-case.js";
import { ListLessonsUseCase } from "../../application/use-cases/list-lessons.use-case.js";
import { UpdateLessonUseCase } from "../../application/use-cases/update-lesson.use-case.js";
import { PrismaLessonsRepository } from "../../infra/repositories/prisma-lessons.repository.js";
import { prisma } from "../../../../shared/infra/prisma/prisma.service.js";
import { verifyJwt } from "../../../../shared/http/middlewares/verify-jwt.js";
import { makeCreateLessonController } from "../controllers/create-lesson.controller.js";
import { makeDeleteLessonController } from "../controllers/delete-lesson.controller.js";
import { makeGetLessonController } from "../controllers/get-lesson.controller.js";
import { makeListLessonsController } from "../controllers/list-lessons.controller.js";
import { makeUpdateLessonController } from "../controllers/update-lesson.controller.js";
import { createLessonRouteSchema } from "../schemas/create-lesson.schema.js";
import { deleteLessonRouteSchema } from "../schemas/delete-lesson.schema.js";
import { getLessonRouteSchema } from "../schemas/get-lesson.schema.js";
import { listLessonsRouteSchema } from "../schemas/list-lessons.schema.js";
import { updateLessonRouteSchema } from "../schemas/update-lesson.schema.js";

export async function lessonRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  const lessonsRepository = new PrismaLessonsRepository(prisma);
  const coursesRepository = new PrismaCoursesRepository(prisma);

  const createLessonUseCase = new CreateLessonUseCase(
    lessonsRepository,
    coursesRepository,
  );
  const listLessonsUseCase = new ListLessonsUseCase(
    lessonsRepository,
    coursesRepository,
  );
  const getLessonUseCase = new GetLessonUseCase(
    lessonsRepository,
    coursesRepository,
  );
  const updateLessonUseCase = new UpdateLessonUseCase(
    lessonsRepository,
    coursesRepository,
  );
  const deleteLessonUseCase = new DeleteLessonUseCase(
    lessonsRepository,
    coursesRepository,
  );

  typedApp.addHook("preHandler", verifyJwt);

  typedApp.get(
    "/",
    {
      schema: listLessonsRouteSchema,
    },
    makeListLessonsController(listLessonsUseCase),
  );

  typedApp.get(
    "/:lessonId",
    {
      schema: getLessonRouteSchema,
    },
    makeGetLessonController(getLessonUseCase),
  );

  typedApp.post(
    "/",
    {
      schema: createLessonRouteSchema,
    },
    makeCreateLessonController(createLessonUseCase),
  );

  typedApp.put(
    "/:lessonId",
    {
      schema: updateLessonRouteSchema,
    },
    makeUpdateLessonController(updateLessonUseCase),
  );

  typedApp.delete(
    "/:lessonId",
    {
      schema: deleteLessonRouteSchema,
    },
    makeDeleteLessonController(deleteLessonUseCase),
  );
}
