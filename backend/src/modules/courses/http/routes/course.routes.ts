import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { CreateCourseUseCase } from "../../application/use-cases/create-course.use-case.js";
import { DeleteCourseUseCase } from "../../application/use-cases/delete-course.use-case.js";
import { GetCourseUseCase } from "../../application/use-cases/get-course.use-case.js";
import { ListCoursesUseCase } from "../../application/use-cases/list-courses.use-case.js";
import { UpdateCourseUseCase } from "../../application/use-cases/update-course.use-case.js";
import { PrismaCoursesRepository } from "../../infra/repositories/prisma-courses.repository.js";
import { prisma } from "../../../../shared/infra/prisma/prisma.service.js";
import { verifyJwt } from "../../../../shared/http/middlewares/verify-jwt.js";
import { makeCreateCourseController } from "../controllers/create-course.controller.js";
import { makeDeleteCourseController } from "../controllers/delete-course.controller.js";
import { makeGetCourseController } from "../controllers/get-course.controller.js";
import { makeListCoursesController } from "../controllers/list-courses.controller.js";
import { makeUpdateCourseController } from "../controllers/update-course.controller.js";
import { createCourseRouteSchema } from "../schemas/create-course.schema.js";
import { deleteCourseRouteSchema } from "../schemas/delete-course.schema.js";
import { getCourseRouteSchema } from "../schemas/get-course.schema.js";
import { listCoursesRouteSchema } from "../schemas/list-courses.schema.js";
import { updateCourseRouteSchema } from "../schemas/update-course.schema.js";

export async function courseRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  const coursesRepository = new PrismaCoursesRepository(prisma);

  const createCourseUseCase = new CreateCourseUseCase(coursesRepository);
  const listCoursesUseCase = new ListCoursesUseCase(coursesRepository);
  const getCourseUseCase = new GetCourseUseCase(coursesRepository);
  const updateCourseUseCase = new UpdateCourseUseCase(coursesRepository);
  const deleteCourseUseCase = new DeleteCourseUseCase(coursesRepository);

  typedApp.addHook("preHandler", verifyJwt);

  typedApp.get(
    "/",
    {
      schema: listCoursesRouteSchema,
    },
    makeListCoursesController(listCoursesUseCase),
  );

  typedApp.get(
    "/:id",
    {
      schema: getCourseRouteSchema,
    },
    makeGetCourseController(getCourseUseCase),
  );

  typedApp.post(
    "/",
    {
      schema: createCourseRouteSchema,
    },
    makeCreateCourseController(createCourseUseCase),
  );

  typedApp.put(
    "/:id",
    {
      schema: updateCourseRouteSchema,
    },
    makeUpdateCourseController(updateCourseUseCase),
  );

  typedApp.delete(
    "/:id",
    {
      schema: deleteCourseRouteSchema,
    },
    makeDeleteCourseController(deleteCourseUseCase),
  );
}
