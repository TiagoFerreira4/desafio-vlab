import type { FastifyInstance } from "fastify";

import type { TokenService } from "../../../modules/auth/infra/services/token-service.js";
import type { AuthUserPayload } from "../../http/types/auth-user.js";

type JwtSigner = Pick<FastifyInstance["jwt"], "sign">;

export class JwtService implements TokenService {
  constructor(private readonly jwt: JwtSigner) {}

  async sign(payload: AuthUserPayload) {
    return this.jwt.sign(payload);
  }
}
