import { describe, expect, it } from "vitest";

import { CourseNotFoundError } from "../../domain/errors/course-not-found-error.js";
import { UnauthorizedCourseActionError } from "../../domain/errors/unauthorized-course-action-error.js";
import { InMemoryCoursesRepository } from "./courses-test-helpers.js";
import { UpdateCourseUseCase } from "./update-course.use-case.js";

describe("UpdateCourseUseCase", () => {
  it("updates a course owned by the authenticated user", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new UpdateCourseUseCase(coursesRepository);

    const result = await useCase.execute({
      id: "course-1",
      name: "Advanced React",
      description: "Hooks and architecture",
      startDate: "2026-05-11",
      endDate: "2026-06-11",
      userId: "user-1",
    });

    expect(result.course).toMatchObject({
      id: "course-1",
      name: "Advanced React",
      description: "Hooks and architecture",
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

    const useCase = new UpdateCourseUseCase(coursesRepository);

    await expect(
      useCase.execute({
        id: "course-1",
        name: "Advanced React",
        startDate: "2026-05-11",
        endDate: "2026-06-11",
        userId: "user-2",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedCourseActionError);
  });

  it("rejects updates for unknown courses", async () => {
    const useCase = new UpdateCourseUseCase(new InMemoryCoursesRepository());

    await expect(
      useCase.execute({
        id: "missing-course",
        name: "Advanced React",
        startDate: "2026-05-11",
        endDate: "2026-06-11",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(CourseNotFoundError);
  });
});
