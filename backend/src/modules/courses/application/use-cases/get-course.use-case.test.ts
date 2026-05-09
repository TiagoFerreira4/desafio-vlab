import { describe, expect, it } from "vitest";

import { CourseNotFoundError } from "../../domain/errors/course-not-found-error.js";
import { UnauthorizedCourseActionError } from "../../domain/errors/unauthorized-course-action-error.js";
import { InMemoryCoursesRepository } from "./courses-test-helpers.js";
import { GetCourseUseCase } from "./get-course.use-case.js";

describe("GetCourseUseCase", () => {
  it("returns a course owned by the authenticated user", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new GetCourseUseCase(coursesRepository);

    const result = await useCase.execute({
      id: "course-1",
      userId: "user-1",
    });

    expect(result.course).toMatchObject({
      id: "course-1",
      name: "React Basics",
      creatorId: "user-1",
    });
  });

  it("rejects reads from users who do not own the course", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new GetCourseUseCase(coursesRepository);

    await expect(
      useCase.execute({
        id: "course-1",
        userId: "user-2",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedCourseActionError);
  });

  it("rejects unknown courses", async () => {
    const useCase = new GetCourseUseCase(new InMemoryCoursesRepository());

    await expect(
      useCase.execute({
        id: "missing-course",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(CourseNotFoundError);
  });
});
