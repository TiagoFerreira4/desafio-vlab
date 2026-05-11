import { describe, expect, it } from "vitest";

import { InvalidLessonStatusError } from "../errors/invalid-lesson-status-error.js";
import { InvalidLessonTitleError } from "../errors/invalid-lesson-title-error.js";
import { InvalidLessonVideoUrlError } from "../errors/invalid-lesson-video-url-error.js";
import { Lesson } from "./lesson.js";

describe("Lesson", () => {
  it("creates a lesson with normalized fields", () => {
    const lesson = Lesson.create({
      courseId: "course-1",
      title: " Introduction ",
      status: "draft",
      videoUrl: " https://example.com/video ",
    });

    expect(lesson.title).toBe("Introduction");
    expect(lesson.status).toBe("draft");
    expect(lesson.videoUrl).toBe("https://example.com/video");
    expect(lesson.belongsToCourse("course-1")).toBe(true);
  });

  it("rejects invalid titles", () => {
    expect(() =>
      Lesson.create({
        courseId: "course-1",
        title: " ab ",
        status: "draft",
      }),
    ).toThrow(InvalidLessonTitleError);
  });

  it("rejects invalid statuses", () => {
    expect(() =>
      Lesson.create({
        courseId: "course-1",
        title: "Introduction",
        status: "archived",
      }),
    ).toThrow(InvalidLessonStatusError);
  });

  it("rejects invalid video URLs", () => {
    expect(() =>
      Lesson.create({
        courseId: "course-1",
        title: "Introduction",
        status: "draft",
        videoUrl: "invalid-url",
      }),
    ).toThrow(InvalidLessonVideoUrlError);
  });

  it("updates mutable fields while preserving identity and course", () => {
    const lesson = Lesson.restore({
      id: "lesson-1",
      courseId: "course-1",
      title: "Introduction",
      status: "draft",
      videoUrl: null,
      createdAt: new Date("2026-05-09T12:00:00.000Z"),
      updatedAt: new Date("2026-05-09T12:00:00.000Z"),
    });

    lesson.update({
      title: " Published intro ",
      status: "published",
      videoUrl: "https://example.com/published",
    });

    expect(lesson.id).toBe("lesson-1");
    expect(lesson.title).toBe("Published intro");
    expect(lesson.status).toBe("published");
    expect(lesson.videoUrl).toBe("https://example.com/published");
    expect(lesson.courseId).toBe("course-1");
  });
});
