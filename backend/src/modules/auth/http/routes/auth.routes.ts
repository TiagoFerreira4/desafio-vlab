import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { GetProfileUseCase } from "../../application/use-cases/get-profile.use-case.js";
import { LoginUseCase } from "../../application/use-cases/login.use-case.js";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case.js";
import { makeLoginController } from "../controllers/login.controller.js";
import { makeMeController } from "../controllers/me.controller.js";
import { makeRegisterController } from "../controllers/register.controller.js";
import { loginRouteSchema } from "../schemas/login.schema.js";
import { meRouteSchema } from "../schemas/me.schema.js";
import { registerRouteSchema } from "../schemas/register.schema.js";
import { BcryptHasher } from "../../../../shared/infra/auth/bcrypt-hasher.js";
import { JwtService } from "../../../../shared/infra/auth/jwt.service.js";
import { prisma } from "../../../../shared/infra/prisma/prisma.service.js";
import { verifyJwt } from "../../../../shared/http/middlewares/verify-jwt.js";
import { PrismaUsersRepository } from "../../../../modules/users/infra/repositories/prisma-users.repository.js";

export async function authRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  const usersRepository = new PrismaUsersRepository(prisma);
  const passwordHasher = new BcryptHasher();
  const tokenService = new JwtService(app.jwt);

  const registerUserUseCase = new RegisterUserUseCase(
    usersRepository,
    passwordHasher,
    tokenService,
  );
  const loginUseCase = new LoginUseCase(
    usersRepository,
    passwordHasher,
    tokenService,
  );
  const getProfileUseCase = new GetProfileUseCase(usersRepository);

  typedApp.post(
    "/register",
    {
      schema: registerRouteSchema,
    },
    makeRegisterController(registerUserUseCase),
  );

  typedApp.post(
    "/login",
    {
      schema: loginRouteSchema,
    },
    makeLoginController(loginUseCase),
  );

  typedApp.get(
    "/me",
    {
      preHandler: [verifyJwt],
      schema: meRouteSchema,
    },
    makeMeController(getProfileUseCase),
  );
}
