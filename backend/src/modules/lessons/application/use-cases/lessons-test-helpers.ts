import { Lesson } from "../../domain/entities/lesson.js";
import type { LessonsRepository } from "../../domain/repositories/lessons-repository.js";

interface CreateLessonTestInput {
  title: string;
  status: string;
  videoUrl?: string | null;
  courseId: string;
}

export class InMemoryLessonsRepository implements LessonsRepository {
  public readonly items = new Map<string, Lesson>();

  async findManyByCourseId(courseId: string) {
    return [...this.items.values()].filter(
      (lesson) => lesson.courseId === courseId,
    );
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async create(input: Lesson | CreateLessonTestInput) {
    const lesson = input instanceof Lesson ? input : Lesson.create(input);
    const now = new Date("2026-05-09T12:00:00.000Z");
    const persistedLesson = Lesson.restore({
      id: `lesson-${this.items.size + 1}`,
      title: lesson.title,
      status: lesson.status,
      videoUrl: lesson.videoUrl,
      courseId: lesson.courseId,
      createdAt: now,
      updatedAt: now,
    });

    this.items.set(persistedLesson.id, persistedLesson);

    return persistedLesson;
  }

  async update(lesson: Lesson) {
    const current = this.items.get(lesson.id);

    if (!current) {
      throw new Error("Lesson not found.");
    }

    const persistedLesson = Lesson.restore({
      id: current.id,
      title: lesson.title,
      status: lesson.status,
      videoUrl: lesson.videoUrl,
      courseId: current.courseId,
      createdAt: current.createdAt,
      updatedAt: new Date("2026-05-09T13:00:00.000Z"),
    });

    this.items.set(persistedLesson.id, persistedLesson);

    return persistedLesson;
  }

  async delete(id: string) {
    this.items.delete(id);
  }
}
