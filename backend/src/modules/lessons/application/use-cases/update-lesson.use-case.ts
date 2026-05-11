import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CoursesRepository } from "../../../courses/domain/repositories/courses-repository.js";
import { ensureCourseExists, ensureCourseOwner } from "../../../courses/application/use-cases/course-ownership.js";
import type { LessonResponseDto } from "../dto/lesson.dto.js";
import { toLessonDto } from "../dto/lesson.dto.js";
import type { UpdateLessonInputDto } from "../dto/update-lesson.dto.js";
import type { LessonsRepository } from "../../domain/repositories/lessons-repository.js";
import {
  ensureLessonBelongsToCourse,
  ensureLessonExists,
} from "./lesson-ownership.js";

export class UpdateLessonUseCase
  implements UseCase<UpdateLessonInputDto, LessonResponseDto>
{
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(input: UpdateLessonInputDto) {
    const course = ensureCourseExists(
      await this.coursesRepository.findById(input.courseId),
    );
    ensureCourseOwner(course, input.userId);

    const existingLesson = ensureLessonExists(
      await this.lessonsRepository.findById(input.lessonId),
    );
    ensureLessonBelongsToCourse(existingLesson, input.courseId);
    existingLesson.update(input);

    const lesson = await this.lessonsRepository.update(existingLesson);

    return {
      lesson: toLessonDto(lesson),
    };
  }
}
