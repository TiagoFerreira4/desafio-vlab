import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(401, "Invalid credentials.");
  }
}
