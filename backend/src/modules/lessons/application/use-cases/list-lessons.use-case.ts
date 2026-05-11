import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CoursesRepository } from "../../../courses/domain/repositories/courses-repository.js";
import { ensureCourseExists, ensureCourseOwner } from "../../../courses/application/use-cases/course-ownership.js";
import type { LessonListResponseDto } from "../dto/lesson.dto.js";
import { toLessonDto } from "../dto/lesson.dto.js";
import type { LessonsRepository } from "../../domain/repositories/lessons-repository.js";

export interface ListLessonsInput {
  courseId: string;
  userId: string;
}

export class ListLessonsUseCase
  implements UseCase<ListLessonsInput, LessonListResponseDto>
{
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(input: ListLessonsInput) {
    const course = ensureCourseExists(
      await this.coursesRepository.findById(input.courseId),
    );
    ensureCourseOwner(course, input.userId);

    const lessons = await this.lessonsRepository.findManyByCourseId(
      input.courseId,
    );

    return {
      lessons: lessons.map(toLessonDto),
    };
  }
}
