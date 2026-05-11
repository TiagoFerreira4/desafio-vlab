import { describe, expect, it } from "vitest";

import { UnauthorizedCourseActionError } from "../../../courses/domain/errors/unauthorized-course-action-error.js";
import { InMemoryCoursesRepository } from "../../../courses/application/use-cases/courses-test-helpers.js";
import { DeleteLessonUseCase } from "./delete-lesson.use-case.js";
import { InMemoryLessonsRepository } from "./lessons-test-helpers.js";

describe("DeleteLessonUseCase", () => {
  it("deletes a lesson from a course owned by the authenticated user", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    const lessonsRepository = new InMemoryLessonsRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });
    await lessonsRepository.create({
      courseId: "course-1",
      title: "Introduction",
      status: "draft",
    });

    const useCase = new DeleteLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    await useCase.execute({
      courseId: "course-1",
      lessonId: "lesson-1",
      userId: "user-1",
    });

    expect(await lessonsRepository.findById("lesson-1")).toBeNull();
  });

  it("rejects deletion from users who do not own the course", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new DeleteLessonUseCase(
      new InMemoryLessonsRepository(),
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        lessonId: "lesson-1",
        userId: "user-2",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedCourseActionError);
  });
});
