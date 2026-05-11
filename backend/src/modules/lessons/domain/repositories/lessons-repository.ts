import type { Lesson } from "../entities/lesson.js";

export interface LessonsRepository {
  findManyByCourseId(courseId: string): Promise<Lesson[]>;
  findById(id: string): Promise<Lesson | null>;
  create(lesson: Lesson): Promise<Lesson>;
  update(lesson: Lesson): Promise<Lesson>;
  delete(id: string): Promise<void>;
}
