import type { AuthUserPayload } from "../../../../shared/http/types/auth-user.js";

export interface TokenService {
  sign(payload: AuthUserPayload): Promise<string>;
}
