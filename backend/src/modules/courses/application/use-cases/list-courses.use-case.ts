import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CourseListResponseDto } from "../dto/course.dto.js";
import { toCourseDto } from "../dto/course.dto.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";

export interface ListCoursesInput {
  creatorId: string;
}

export class ListCoursesUseCase
  implements UseCase<ListCoursesInput, CourseListResponseDto>
{
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute(input: ListCoursesInput) {
    const courses = await this.coursesRepository.findManyByCreatorId(
      input.creatorId,
    );

    return {
      courses: courses.map(toCourseDto),
    };
  }
}
