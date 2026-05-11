import { AppError } from "../../../../shared/domain/errors/app-error.js";

export class InvalidLessonStatusError extends AppError {
  constructor() {
    super(400, 'Lesson status must be either "draft" or "published".');
  }
}
