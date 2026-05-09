import { CourseNotFoundError } from "../../domain/errors/course-not-found-error.js";
import { UnauthorizedCourseActionError } from "../../domain/errors/unauthorized-course-action-error.js";
import type { CourseRecord } from "../../domain/repositories/courses-repository.js";

export function ensureCourseExists(
  course: CourseRecord | null,
): CourseRecord {
  if (!course) {
    throw new CourseNotFoundError();
  }

  return course;
}

export function ensureCourseOwner(course: CourseRecord, userId: string) {
  if (course.creatorId !== userId) {
    throw new UnauthorizedCourseActionError();
  }
}
