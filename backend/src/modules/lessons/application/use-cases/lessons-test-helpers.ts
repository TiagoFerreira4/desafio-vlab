import type {
  CreateLessonInput,
  LessonRecord,
  LessonsRepository,
  UpdateLessonInput,
} from "../../domain/repositories/lessons-repository.js";

export class InMemoryLessonsRepository implements LessonsRepository {
  public readonly items = new Map<string, LessonRecord>();

  async findManyByCourseId(courseId: string) {
    return [...this.items.values()].filter(
      (lesson) => lesson.courseId === courseId,
    );
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async create(input: CreateLessonInput) {
    const now = new Date("2026-05-09T12:00:00.000Z");
    const lesson: LessonRecord = {
      id: `lesson-${this.items.size + 1}`,
      title: input.title,
      status: input.status,
      videoUrl: input.videoUrl ?? null,
      courseId: input.courseId,
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(lesson.id, lesson);

    return lesson;
  }

  async update(id: string, input: UpdateLessonInput) {
    const current = this.items.get(id);

    if (!current) {
      throw new Error("Lesson not found.");
    }

    const lesson: LessonRecord = {
      ...current,
      title: input.title,
      status: input.status,
      videoUrl: input.videoUrl ?? null,
      updatedAt: new Date("2026-05-09T13:00:00.000Z"),
    };

    this.items.set(id, lesson);

    return lesson;
  }

  async delete(id: string) {
    this.items.delete(id);
  }
}
