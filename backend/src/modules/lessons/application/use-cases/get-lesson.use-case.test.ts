import { describe, expect, it } from "vitest";

import { InMemoryCoursesRepository } from "../../../courses/application/use-cases/courses-test-helpers.js";
import { LessonNotFoundError } from "../../domain/errors/lesson-not-found-error.js";
import { GetLessonUseCase } from "./get-lesson.use-case.js";
import { InMemoryLessonsRepository } from "./lessons-test-helpers.js";

describe("GetLessonUseCase", () => {
  it("returns a lesson from a course", async () => {
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

    const useCase = new GetLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    const result = await useCase.execute({
      courseId: "course-1",
      lessonId: "lesson-1",
      userId: "user-1",
    });

    expect(result.lesson).toMatchObject({
      id: "lesson-1",
      title: "Introduction",
      courseId: "course-1",
    });
  });

  it("returns a published lesson to users who do not own the course", async () => {
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
      title: "Published Introduction",
      status: "published",
    });

    const useCase = new GetLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    const result = await useCase.execute({
      courseId: "course-1",
      lessonId: "lesson-1",
      userId: "user-2",
    });

    expect(result.lesson).toMatchObject({
      id: "lesson-1",
      status: "published",
    });
  });

  it("hides draft lessons from users who do not own the course", async () => {
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
      title: "Draft Introduction",
      status: "draft",
    });

    const useCase = new GetLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        lessonId: "lesson-1",
        userId: "user-2",
      }),
    ).rejects.toBeInstanceOf(LessonNotFoundError);
  });

  it("rejects unknown lessons", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new GetLessonUseCase(
      new InMemoryLessonsRepository(),
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        lessonId: "missing-lesson",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(LessonNotFoundError);
  });

  it("rejects lessons that do not belong to the route course", async () => {
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

    const useCase = new GetLessonUseCase(
      lessonsRepository,
      coursesRepository,
    );

    await expect(
      useCase.execute({
        courseId: "course-1",
        lessonId: "lesson-1",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(LessonNotFoundError);
  });
});
