import { compare, hash } from "bcryptjs";

import type { PasswordHasher } from "../../../modules/auth/infra/services/password-hasher.js";

const SALT_ROUNDS = 10;

export class BcryptHasher implements PasswordHasher {
  async hash(value: string) {
    return hash(value, SALT_ROUNDS);
  }

  async compare(value: string, hashedValue: string) {
    return compare(value, hashedValue);
  }
}
