import { describe, expect, it } from "vitest";

import { UnauthorizedCourseActionError } from "../../../courses/domain/errors/unauthorized-course-action-error.js";
import { InMemoryCoursesRepository } from "../../../courses/application/use-cases/courses-test-helpers.js";
import { InvalidLessonStatusError } from "../../domain/errors/invalid-lesson-status-error.js";
import { LessonNotFoundError } from "../../domain/errors/lesson-not-found-error.js";
import { InMemoryLessonsRepository } from "./lessons-test-helpers.js";
import { UpdateLessonUseCase } from "./update-lesson.use-case.js";

describe("UpdateLessonUseCase", () => {
  it("updates a lesson from a course owned by the authenticated user", async () => {
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

    const useCase = new UpdateLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    const result = await useCase.execute({
      courseId: "course-1",
      lessonId: "lesson-1",
      title: "Published intro",
      status: "published",
      videoUrl: "https://example.com/published",
      userId: "user-1",
    });

    expect(result.lesson).toMatchObject({
      id: "lesson-1",
      title: "Published intro",
      status: "published",
      videoUrl: "https://example.com/published",
    });
  });

  it("rejects updates from users who do not own the course", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new UpdateLessonUseCase(
      new InMemoryLessonsRepository(),
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        lessonId: "lesson-1",
        title: "Introduction",
        status: "draft",
        userId: "user-2",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedCourseActionError);
  });

  it("rejects invalid statuses", async () => {
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

    const useCase = new UpdateLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        lessonId: "lesson-1",
        title: "Introduction",
        status: "archived",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(InvalidLessonStatusError);
  });

  it("rejects updates when the lesson does not belong to the route course", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    const lessonsRepository = new InMemoryLessonsRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });
    await coursesRepository.create({
      name: "Node Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });
    await lessonsRepository.create({
      courseId: "course-2",
      title: "Introduction",
      status: "draft",
    });

    const useCase = new UpdateLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        lessonId: "lesson-1",
        title: "Introduction",
        status: "draft",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(LessonNotFoundError);
  });
});
