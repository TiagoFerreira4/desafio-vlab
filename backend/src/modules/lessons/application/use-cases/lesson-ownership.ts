import { LessonNotFoundError } from "../../domain/errors/lesson-not-found-error.js";
import type { LessonRecord } from "../../domain/repositories/lessons-repository.js";

export function ensureLessonExists(
  lesson: LessonRecord | null,
): LessonRecord {
  if (!lesson) {
    throw new LessonNotFoundError();
  }

  return lesson;
}

export function ensureLessonBelongsToCourse(
  lesson: LessonRecord,
  courseId: string,
) {
  if (lesson.courseId !== courseId) {
    throw new LessonNotFoundError();
  }
}
