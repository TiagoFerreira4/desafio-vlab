import { describe, expect, it } from "vitest";

import { InvalidCourseDateError } from "../../domain/errors/invalid-course-date-error.js";
import { InvalidCourseNameError } from "../../domain/errors/invalid-course-name-error.js";
import { CreateCourseUseCase } from "./create-course.use-case.js";
import { InMemoryCoursesRepository } from "./courses-test-helpers.js";

describe("CreateCourseUseCase", () => {
  it("creates a course for the authenticated user", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    const useCase = new CreateCourseUseCase(coursesRepository);

    const result = await useCase.execute({
      name: " React Basics ",
      description: " Intro course ",
      startDate: "2026-05-10",
      endDate: "2026-06-10",
      creatorId: "user-1",
    });

    expect(result.course).toMatchObject({
      id: "course-1",
      name: "React Basics",
      description: "Intro course",
      creatorId: "user-1",
    });
    expect(coursesRepository.items.get("course-1")?.creatorId).toBe("user-1");
  });

  it("rejects names shorter than 3 characters after trimming", async () => {
    const useCase = new CreateCourseUseCase(new InMemoryCoursesRepository());

    await expect(
      useCase.execute({
        name: " ab ",
        startDate: "2026-05-10",
        endDate: "2026-06-10",
        creatorId: "user-1",
      }),
    ).rejects.toBeInstanceOf(InvalidCourseNameError);
  });

  it("rejects an end date before the start date", async () => {
    const useCase = new CreateCourseUseCase(new InMemoryCoursesRepository());

    await expect(
      useCase.execute({
        name: "React Basics",
        startDate: "2026-06-10",
        endDate: "2026-05-10",
        creatorId: "user-1",
      }),
    ).rejects.toBeInstanceOf(InvalidCourseDateError);
  });
});
