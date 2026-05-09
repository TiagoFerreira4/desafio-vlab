import { describe, expect, it } from "vitest";

import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials-error.js";
import { InMemoryUsersRepository } from "./auth-test-helpers.js";
import { GetProfileUseCase } from "./get-profile.use-case.js";

describe("GetProfileUseCase", () => {
  it("returns the authenticated user profile", async () => {
    const usersRepository = new InMemoryUsersRepository();
    await usersRepository.create({
      name: "Tiago",
      email: "tiago@example.com",
      passwordHash: "hashed:123456",
    });

    const useCase = new GetProfileUseCase(usersRepository);

    const result = await useCase.execute({
      userId: "user-1",
    });

    expect(result).toEqual({
      user: {
        id: "user-1",
        name: "Tiago",
        email: "tiago@example.com",
      },
    });
  });

  it("rejects missing user", async () => {
    const useCase = new GetProfileUseCase(new InMemoryUsersRepository());

    await expect(
      useCase.execute({
        userId: "missing-user",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
