import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CoursesRepository } from "../../../courses/domain/repositories/courses-repository.js";
import { ensureCourseExists, ensureCourseOwner } from "../../../courses/application/use-cases/course-ownership.js";
import type { LessonResponseDto } from "../dto/lesson.dto.js";
import { toLessonDto } from "../dto/lesson.dto.js";
import type { LessonsRepository } from "../../domain/repositories/lessons-repository.js";
import {
  ensureLessonBelongsToCourse,
  ensureLessonExists,
} from "./lesson-ownership.js";

export interface GetLessonInput {
  courseId: string;
  lessonId: string;
  userId: string;
}

export class GetLessonUseCase implements UseCase<GetLessonInput, LessonResponseDto> {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(input: GetLessonInput) {
    const course = ensureCourseExists(
      await this.coursesRepository.findById(input.courseId),
    );
    ensureCourseOwner(course, input.userId);

    const lesson = ensureLessonExists(
      await this.lessonsRepository.findById(input.lessonId),
    );
    ensureLessonBelongsToCourse(lesson, input.courseId);

    return {
      lesson: toLessonDto(lesson),
    };
  }
}
