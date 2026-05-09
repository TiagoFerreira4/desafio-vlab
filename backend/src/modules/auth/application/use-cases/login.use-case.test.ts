import { describe, expect, it } from "vitest";

import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials-error.js";
import {
  FakePasswordHasher,
  FakeTokenService,
  InMemoryUsersRepository,
} from "./auth-test-helpers.js";
import { LoginUseCase } from "./login.use-case.js";

describe("LoginUseCase", () => {
  it("returns user plus token for valid credentials", async () => {
    const usersRepository = new InMemoryUsersRepository();
    await usersRepository.create({
      name: "Tiago",
      email: "tiago@example.com",
      passwordHash: "hashed:123456",
    });

    const useCase = new LoginUseCase(
      usersRepository,
      new FakePasswordHasher(),
      new FakeTokenService(),
    );

    const result = await useCase.execute({
      email: "tiago@example.com",
      password: "123456",
    });

    expect(result.user).toEqual({
      id: "user-1",
      name: "Tiago",
      email: "tiago@example.com",
    });
    expect(result.token).toBe("user-1:tiago@example.com:token");
  });

  it("rejects unknown email", async () => {
    const useCase = new LoginUseCase(
      new InMemoryUsersRepository(),
      new FakePasswordHasher(),
      new FakeTokenService(),
    );

    await expect(
      useCase.execute({
        email: "missing@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("rejects wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    await usersRepository.create({
      name: "Tiago",
      email: "tiago@example.com",
      passwordHash: "hashed:123456",
    });

    const useCase = new LoginUseCase(
      usersRepository,
      new FakePasswordHasher(),
      new FakeTokenService(),
    );

    await expect(
      useCase.execute({
        email: "tiago@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
