import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class InvalidLessonVideoUrlError extends AppError {
  constructor() {
    super(400, "Lesson video URL must be a valid URL.");
  }
}
