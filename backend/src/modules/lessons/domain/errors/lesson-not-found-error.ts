import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class LessonNotFoundError extends AppError {
  constructor() {
    super(404, "Lesson not found.");
  }
}
