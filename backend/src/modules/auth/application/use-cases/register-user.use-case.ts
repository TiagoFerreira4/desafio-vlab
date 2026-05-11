import type { UseCase } from "../../../../shared/application/use-case.js";
import type { UsersRepository } from "../../../../modules/users/domain/repositories/users-repository.js";
import { User } from "../../../../modules/users/domain/entities/user.js";
import { UserAlreadyExistsError } from "../../domain/errors/user-already-exists-error.js";
import type { PasswordHasher } from "../../infra/services/password-hasher.js";
import type { TokenService } from "../../infra/services/token-service.js";
import type { AuthResponseDto } from "../dto/auth-user.dto.js";
import { toPublicUserDto } from "../dto/auth-user.dto.js";
import type { RegisterUserInput } from "../dto/register.dto.js";

export class RegisterUserUseCase
  implements UseCase<RegisterUserInput, AuthResponseDto>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: RegisterUserInput) {
    const existingUser = await this.usersRepository.findByEmail(input.email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.usersRepository.create(User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    }));

    const token = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user: toPublicUserDto(user),
      token,
    };
  }
}
