import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetProfileUseCase } from "../../application/use-cases/get-profile.use-case.js";

export function makeMeController(useCase: GetProfileUseCase) {
  return async function meController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const result = await useCase.execute({
      userId: request.user.sub,
    });

    return reply.send(result);
  };
}
