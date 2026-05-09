import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJwt(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  await request.jwtVerify();
}
