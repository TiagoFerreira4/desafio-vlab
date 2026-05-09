import type { FastifyReply, FastifyRequest } from "fastify";

import type { RegisterUserInput } from "../../application/dto/register.dto.js";
import type { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case.js";

type RegisterRequest = FastifyRequest<{
  Body: RegisterUserInput;
}>;

export function makeRegisterController(useCase: RegisterUserUseCase) {
  return async function registerController(
    request: RegisterRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute(request.body);

    return reply.status(201).send(result);
  };
}
