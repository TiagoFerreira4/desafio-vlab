import { describe, expect, it } from "vitest";

import { InMemoryCoursesRepository } from "./courses-test-helpers.js";
import { ListCoursesUseCase } from "./list-courses.use-case.js";

describe("ListCoursesUseCase", () => {
  it("lists only courses owned by the authenticated user", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
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
      creatorId: "user-2",
    });

    const useCase = new ListCoursesUseCase(coursesRepository);

    const result = await useCase.execute({
      creatorId: "user-1",
    });

    expect(result.courses).toHaveLength(1);
    expect(result.courses[0]?.name).toBe("React Basics");
  });
});
