import { CourseNotFoundError } from "../../domain/errors/course-not-found-error.js";
import { UnauthorizedCourseActionError } from "../../domain/errors/unauthorized-course-action-error.js";
import type { Course } from "../../domain/entities/course.js";

export function ensureCourseExists(
  course: Course | null,
): Course {
  if (!course) {
    throw new CourseNotFoundError();
  }

  return course;
}

export function ensureCourseOwner(course: Course, userId: string) {
  if (!course.isCreatedBy(userId)) {
    throw new UnauthorizedCourseActionError();
  }
}
