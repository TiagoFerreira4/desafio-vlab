import { describe, expect, it } from "vitest";

import { InMemoryCoursesRepository } from "../../../courses/application/use-cases/courses-test-helpers.js";
import { InMemoryLessonsRepository } from "./lessons-test-helpers.js";
import { ListLessonsUseCase } from "./list-lessons.use-case.js";

describe("ListLessonsUseCase", () => {
  it("lists draft and published lessons for the course creator", async () => {
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
    await lessonsRepository.create({
      courseId: "course-1",
      title: "Publishing",
      status: "published",
    });

    const useCase = new ListLessonsUseCase(
      lessonsRepository,
      coursesRepository,
    );

    const result = await useCase.execute({
      courseId: "course-1",
      userId: "user-1",
    });

    expect(result.lessons).toHaveLength(2);
    expect(result.lessons.map((lesson) => lesson.status)).toEqual([
      "draft",
      "published",
    ]);
  });

  it("lists only published lessons for users who do not own the course", async () => {
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
    await lessonsRepository.create({
      courseId: "course-1",
      title: "Published Introduction",
      status: "published",
    });

    const useCase = new ListLessonsUseCase(
      lessonsRepository,
      coursesRepository,
    );

    const result = await useCase.execute({
      courseId: "course-1",
      userId: "user-2",
    });

    expect(result.lessons).toHaveLength(1);
    expect(result.lessons[0]?.title).toBe("Published Introduction");
    expect(result.lessons[0]?.status).toBe("published");
  });
});
