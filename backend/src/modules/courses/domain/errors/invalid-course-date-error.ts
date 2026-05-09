import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class InvalidCourseDateError extends AppError {
  constructor() {
    super(400, "Course end date must be equal to or after start date.");
  }
}
