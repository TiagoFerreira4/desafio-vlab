import { LessonNotFoundError } from "../../domain/errors/lesson-not-found-error.js";
import type { Lesson } from "../../domain/entities/lesson.js";

export function ensureLessonExists(
  lesson: Lesson | null,
): Lesson {
  if (!lesson) {
    throw new LessonNotFoundError();
  }

  return lesson;
}

export function ensureLessonBelongsToCourse(
  lesson: Lesson,
  courseId: string,
) {
  if (!lesson.belongsToCourse(courseId)) {
    throw new LessonNotFoundError();
  }
}
