import type { User } from "../../../../modules/users/domain/entities/user.js";

export interface PublicUserDto {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponseDto {
  user: PublicUserDto;
  token: string;
}

export interface ProfileResponseDto {
  user: PublicUserDto;
}

export function toPublicUserDto(
  user: Pick<User, "id" | "name" | "email">,
): PublicUserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
