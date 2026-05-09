import { describe, expect, it } from "vitest";

import { CourseNotFoundError } from "../../domain/errors/course-not-found-error.js";
import { UnauthorizedCourseActionError } from "../../domain/errors/unauthorized-course-action-error.js";
import { DeleteCourseUseCase } from "./delete-course.use-case.js";
import { InMemoryCoursesRepository } from "./courses-test-helpers.js";

describe("DeleteCourseUseCase", () => {
  it("deletes a course owned by the authenticated user", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new DeleteCourseUseCase(coursesRepository);

    await useCase.execute({
      id: "course-1",
      userId: "user-1",
    });

    expect(await coursesRepository.findById("course-1")).toBeNull();
  });

  it("rejects deletion from users who do not own the course", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new DeleteCourseUseCase(coursesRepository);

    await expect(
      useCase.execute({
        id: "course-1",
        userId: "user-2",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedCourseActionError);
  });

  it("rejects deletion for unknown courses", async () => {
    const useCase = new DeleteCourseUseCase(new InMemoryCoursesRepository());

    await expect(
      useCase.execute({
        id: "missing-course",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(CourseNotFoundError);
  });
});
