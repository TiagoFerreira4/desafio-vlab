import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CoursesRepository } from "../../../courses/domain/repositories/courses-repository.js";
import { ensureCourseExists, ensureCourseOwner } from "../../../courses/application/use-cases/course-ownership.js";
import type { LessonsRepository } from "../../domain/repositories/lessons-repository.js";
import {
  ensureLessonBelongsToCourse,
  ensureLessonExists,
} from "./lesson-ownership.js";

export interface DeleteLessonInput {
  courseId: string;
  lessonId: string;
  userId: string;
}

export class DeleteLessonUseCase implements UseCase<DeleteLessonInput, void> {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(input: DeleteLessonInput) {
    const course = ensureCourseExists(
      await this.coursesRepository.findById(input.courseId),
    );
    ensureCourseOwner(course, input.userId);

    const lesson = ensureLessonExists(
      await this.lessonsRepository.findById(input.lessonId),
    );
    ensureLessonBelongsToCourse(lesson, input.courseId);

    await this.lessonsRepository.delete(input.lessonId);
  }
}
