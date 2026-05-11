import { User } from "../../../../modules/users/domain/entities/user.js";
import type { UsersRepository } from "../../../../modules/users/domain/repositories/users-repository.js";
import type { PasswordHasher } from "../../infra/services/password-hasher.js";
import type { TokenService } from "../../infra/services/token-service.js";

interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

export class InMemoryUsersRepository implements UsersRepository {
  public readonly items = new Map<string, User>();

  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    return (
      [...this.items.values()].find((item) => item.email === normalizedEmail) ??
      null
    );
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async create(input: CreateUserInput | User) {
    const user = User.restore({
      id: `user-${this.items.size + 1}`,
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
    });

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
