import type { PrismaClient, User } from "@prisma/client";

import { User as UserEntity } from "../../domain/entities/user.js";
import type { UsersRepository } from "../../domain/repositories/users-repository.js";

function toUserEntity(user: User) {
  return UserEntity.restore({
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
  });
}

export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    return user ? toUserEntity(user) : null;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? toUserEntity(user) : null;
  }

  async create(input: UserEntity) {
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
      },
    });

    return toUserEntity(user);
  }
}
