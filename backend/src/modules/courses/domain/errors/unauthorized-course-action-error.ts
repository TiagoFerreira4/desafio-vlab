import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class UnauthorizedCourseActionError extends AppError {
  constructor() {
    super(403, "You are not allowed to manage this course.");
  }
}
