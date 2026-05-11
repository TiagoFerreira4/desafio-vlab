import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class InvalidLessonTitleError extends AppError {
  constructor() {
    super(400, "Lesson title must contain at least 3 characters.");
  }
}
