import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CoursesRepository } from "../../../courses/domain/repositories/courses-repository.js";
import { ensureCourseExists, ensureCourseOwner } from "../../../courses/application/use-cases/course-ownership.js";
import type { CreateLessonInputDto } from "../dto/create-lesson.dto.js";
import type { LessonResponseDto } from "../dto/lesson.dto.js";
import { toLessonDto } from "../dto/lesson.dto.js";
import { Lesson } from "../../domain/entities/lesson.js";
import type { LessonsRepository } from "../../domain/repositories/lessons-repository.js";

export class CreateLessonUseCase
  implements UseCase<CreateLessonInputDto, LessonResponseDto>
{
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(input: CreateLessonInputDto) {
    const course = ensureCourseExists(
      await this.coursesRepository.findById(input.courseId),
    );
    ensureCourseOwner(course, input.userId);

    const lesson = await this.lessonsRepository.create(Lesson.create(input));

    return {
      lesson: toLessonDto(lesson),
    };
  }
}
