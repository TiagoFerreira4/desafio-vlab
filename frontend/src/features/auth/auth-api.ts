import { apiRequest } from "../../shared/api/api-client";
import type {
  AuthResponse,
  LoginInput,
  ProfileResponse,
  RegisterInput,
} from "./types";

export function login(input: LoginInput) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export function register(input: RegisterInput) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function getProfile(token: string) {
  return apiRequest<ProfileResponse>("/auth/me", {
    token,
  });
}
