import type { PrismaClient, User } from "@prisma/client";

import type {
  CreateUserInput,
  UserRecord,
  UsersRepository,
} from "../../domain/repositories/users-repository.js";

function toUserRecord(user: User): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
  };
}

export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? toUserRecord(user) : null;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? toUserRecord(user) : null;
  }

  async create(input: CreateUserInput) {
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
      },
    });

    return toUserRecord(user);
  }
}
