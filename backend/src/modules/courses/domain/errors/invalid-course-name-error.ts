import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class InvalidCourseNameError extends AppError {
  constructor() {
    super(400, "Course name must contain at least 3 characters.");
  }
}
