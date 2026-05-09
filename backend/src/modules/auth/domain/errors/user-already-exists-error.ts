import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super(409, "User already exists.");
  }
}
