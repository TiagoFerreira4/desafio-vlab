import type {
  CreateUserInput,
  UserRecord,
  UsersRepository,
} from "../../../../modules/users/domain/repositories/users-repository.js";
import type { PasswordHasher } from "../../infra/services/password-hasher.js";
import type { TokenService } from "../../infra/services/token-service.js";

export class InMemoryUsersRepository implements UsersRepository {
  public readonly items = new Map<string, UserRecord>();

  async findByEmail(email: string) {
    return [...this.items.values()].find((item) => item.email === email) ?? null;
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async create(input: CreateUserInput) {
    const user: UserRecord = {
      id: `user-${this.items.size + 1}`,
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
    };

    this.items.set(user.id, user);

    return user;
  }
}

export class FakePasswordHasher implements PasswordHasher {
  async hash(value: string) {
    return `hashed:${value}`;
  }

  async compare(value: string, hashedValue: string) {
    return hashedValue === `hashed:${value}`;
  }
}

export class FakeTokenService implements TokenService {
  async sign(payload: { sub: string; email: string }) {
    return `${payload.sub}:${payload.email}:token`;
  }
}
