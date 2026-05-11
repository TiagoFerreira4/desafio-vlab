import { describe, expect, it } from "vitest";

import { InvalidCourseDateError } from "../errors/invalid-course-date-error.js";
import { InvalidCourseNameError } from "../errors/invalid-course-name-error.js";
import { Course } from "./course.js";

describe("Course", () => {
  it("creates a course with normalized fields", () => {
    const course = Course.create({
      name: " React Basics ",
      description: " Intro course ",
      startDate: "2026-05-10",
      endDate: "2026-06-10",
      creatorId: "user-1",
    });

    expect(course.name).toBe("React Basics");
    expect(course.description).toBe("Intro course");
    expect(course.creatorId).toBe("user-1");
    expect(course.isCreatedBy("user-1")).toBe(true);
  });

  it("rejects invalid names", () => {
    expect(() =>
      Course.create({
        name: " ab ",
        startDate: "2026-05-10",
        endDate: "2026-06-10",
        creatorId: "user-1",
      }),
    ).toThrow(InvalidCourseNameError);
  });

  it("rejects an end date before the start date", () => {
    expect(() =>
      Course.create({
        name: "React Basics",
        startDate: "2026-06-10",
        endDate: "2026-05-10",
        creatorId: "user-1",
      }),
    ).toThrow(InvalidCourseDateError);
  });

  it("updates mutable fields while preserving identity", () => {
    const course = Course.restore({
      id: "course-1",
      name: "React Basics",
      description: null,
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-06-10"),
      creatorId: "user-1",
      createdAt: new Date("2026-05-09T12:00:00.000Z"),
      updatedAt: new Date("2026-05-09T12:00:00.000Z"),
    });

    course.update({
      name: " Advanced React ",
      description: " Hooks ",
      startDate: "2026-07-01",
      endDate: "2026-08-01",
    });

    expect(course.id).toBe("course-1");
    expect(course.name).toBe("Advanced React");
    expect(course.description).toBe("Hooks");
    expect(course.creatorId).toBe("user-1");
  });
});
