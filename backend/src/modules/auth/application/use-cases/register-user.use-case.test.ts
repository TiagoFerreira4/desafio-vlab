import { describe, expect, it } from "vitest";

import { UserAlreadyExistsError } from "../../domain/errors/user-already-exists-error.js";
import {
  FakePasswordHasher,
  FakeTokenService,
  InMemoryUsersRepository,
} from "./auth-test-helpers.js";
import { RegisterUserUseCase } from "./register-user.use-case.js";

describe("RegisterUserUseCase", () => {
  it("registers a user and returns user plus token", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const useCase = new RegisterUserUseCase(
      usersRepository,
      new FakePasswordHasher(),
      new FakeTokenService(),
    );

    const result = await useCase.execute({
      name: "Tiago",
      email: "tiago@example.com",
      password: "123456",
    });

    expect(result.user).toEqual({
      id: "user-1",
      name: "Tiago",
      email: "tiago@example.com",
    });
    expect(result.token).toBe("user-1:tiago@example.com:token");
    expect(usersRepository.items.get("user-1")?.passwordHash).toBe(
      "hashed:123456",
    );
  });

  it("rejects duplicated email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    await usersRepository.create({
      name: "Tiago",
      email: "tiago@example.com",
      passwordHash: "hashed:123456",
    });

    const useCase = new RegisterUserUseCase(
      usersRepository,
      new FakePasswordHasher(),
      new FakeTokenService(),
    );

    await expect(
      useCase.execute({
        name: "Another",
        email: "tiago@example.com",
        password: "abcdef",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
