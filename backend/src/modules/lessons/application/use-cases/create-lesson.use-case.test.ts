import { describe, expect, it } from "vitest";

import { CourseNotFoundError } from "../../../courses/domain/errors/course-not-found-error.js";
import { UnauthorizedCourseActionError } from "../../../courses/domain/errors/unauthorized-course-action-error.js";
import { InMemoryCoursesRepository } from "../../../courses/application/use-cases/courses-test-helpers.js";
import { InvalidLessonTitleError } from "../../domain/errors/invalid-lesson-title-error.js";
import { InvalidLessonVideoUrlError } from "../../domain/errors/invalid-lesson-video-url-error.js";
import { CreateLessonUseCase } from "./create-lesson.use-case.js";
import { InMemoryLessonsRepository } from "./lessons-test-helpers.js";

describe("CreateLessonUseCase", () => {
  it("creates a lesson in a course owned by the authenticated user", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    const lessonsRepository = new InMemoryLessonsRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new CreateLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    const result = await useCase.execute({
      courseId: "course-1",
      title: " Introduction ",
      status: "draft",
      videoUrl: " https://example.com/video ",
      userId: "user-1",
    });

    expect(result.lesson).toMatchObject({
      id: "lesson-1",
      title: "Introduction",
      status: "draft",
      videoUrl: "https://example.com/video",
      courseId: "course-1",
    });
  });

  it("rejects lessons for unknown courses", async () => {
    const useCase = new CreateLessonUseCase(
      new InMemoryLessonsRepository(),
      new InMemoryCoursesRepository(),
    );

    await expect(
      useCase.execute({
        courseId: "missing-course",
        title: "Introduction",
        status: "draft",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(CourseNotFoundError);
  });

  it("rejects lessons from users who do not own the course", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new CreateLessonUseCase(
      new InMemoryLessonsRepository(),
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        title: "Introduction",
        status: "draft",
        userId: "user-2",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedCourseActionError);
  });

  it("rejects titles shorter than 3 characters after trimming", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new CreateLessonUseCase(
      new InMemoryLessonsRepository(),
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        title: " ab ",
        status: "draft",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(InvalidLessonTitleError);
  });

  it("rejects invalid video URLs", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new CreateLessonUseCase(
      new InMemoryLessonsRepository(),
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        title: "Introduction",
        status: "draft",
        videoUrl: "invalid-url",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(InvalidLessonVideoUrlError);
  });
});
