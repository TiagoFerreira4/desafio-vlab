import type { FastifyReply, FastifyRequest } from "fastify";

import type { LoginInput } from "../../application/dto/login.dto.js";
import type { LoginUseCase } from "../../application/use-cases/login.use-case.js";

type LoginRequest = FastifyRequest<{
  Body: LoginInput;
}>;

export function makeLoginController(useCase: LoginUseCase) {
  return async function loginController(
    request: LoginRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute(request.body);

    return reply.send(result);
  };
}
