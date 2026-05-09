import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class CourseNotFoundError extends AppError {
  constructor() {
    super(404, "Course not found.");
  }
}
