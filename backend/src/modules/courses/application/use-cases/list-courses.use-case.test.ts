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

  it("lists all courses when scope is all", async () => {
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
      scope: "all",
    });

    expect(result.courses).toHaveLength(2);
    expect(result.courses.map((course) => course.name)).toEqual([
      "React Basics",
      "Node Basics",
    ]);
  });

  it("filters courses by name using a partial case-insensitive search", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });
    await coursesRepository.create({
      name: "Advanced Node",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });
    await coursesRepository.create({
      name: "Advanced React",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-2",
    });

    const useCase = new ListCoursesUseCase(coursesRepository);

    const result = await useCase.execute({
      creatorId: "user-1",
      search: "  REACT  ",
    });

    expect(result.courses).toHaveLength(1);
    expect(result.courses[0]?.name).toBe("React Basics");
  });

  it("filters all courses by name when scope is all", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });
    await coursesRepository.create({
      name: "Advanced React",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-2",
    });
    await coursesRepository.create({
      name: "Node Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-3",
    });

    const useCase = new ListCoursesUseCase(coursesRepository);

    const result = await useCase.execute({
      creatorId: "user-1",
      scope: "all",
      search: "react",
    });

    expect(result.courses).toHaveLength(2);
    expect(result.courses.map((course) => course.creatorId)).toEqual([
      "user-1",
      "user-2",
    ]);
  });

  it("ignores empty search terms", async () => {
    const coursesRepository = new InMemoryCoursesRepository();
    await coursesRepository.create({
      name: "React Basics",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
    });

    const useCase = new ListCoursesUseCase(coursesRepository);

    const result = await useCase.execute({
      creatorId: "user-1",
      search: "   ",
    });

    expect(result.courses).toHaveLength(1);
    expect(result.courses[0]?.name).toBe("React Basics");
  });
});
