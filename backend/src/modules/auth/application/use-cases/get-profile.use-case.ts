import type { UseCase } from "../../../../shared/application/use-case.js";
import type { UsersRepository } from "../../../../modules/users/domain/repositories/users-repository.js";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials-error.js";
import type { ProfileResponseDto } from "../dto/auth-user.dto.js";
import { toPublicUserDto } from "../dto/auth-user.dto.js";

export interface GetProfileInput {
  userId: string;
}

export class GetProfileUseCase
  implements UseCase<GetProfileInput, ProfileResponseDto>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: GetProfileInput) {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    return {
      user: toPublicUserDto(user),
    };
  }
}
