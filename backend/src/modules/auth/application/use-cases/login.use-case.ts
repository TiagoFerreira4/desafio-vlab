import type { UseCase } from "../../../../shared/application/use-case.js";
import type { UsersRepository } from "../../../../modules/users/domain/repositories/users-repository.js";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials-error.js";
import type { PasswordHasher } from "../../infra/services/password-hasher.js";
import type { TokenService } from "../../infra/services/token-service.js";
import type { AuthResponseDto } from "../dto/auth-user.dto.js";
import { toPublicUserDto } from "../dto/auth-user.dto.js";
import type { LoginInput } from "../dto/login.dto.js";

export class LoginUseCase implements UseCase<LoginInput, AuthResponseDto> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginInput) {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

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
