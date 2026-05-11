import type { Lesson } from "../entities/lesson.js";
import type { LessonStatus } from "../entities/lesson.js";

export interface FindManyLessonsInput {
  courseId: string;
  status?: LessonStatus;
}

export interface LessonsRepository {
  findManyByCourseId(input: FindManyLessonsInput): Promise<Lesson[]>;
  findById(id: string): Promise<Lesson | null>;
  create(lesson: Lesson): Promise<Lesson>;
  update(lesson: Lesson): Promise<Lesson>;
  delete(id: string): Promise<void>;
}
