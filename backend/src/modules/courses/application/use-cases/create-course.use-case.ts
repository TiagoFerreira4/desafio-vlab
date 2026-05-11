import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CourseResponseDto } from "../dto/course.dto.js";
import { toCourseDto } from "../dto/course.dto.js";
import type { CreateCourseInputDto } from "../dto/create-course.dto.js";
import { Course } from "../../domain/entities/course.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";

export class CreateCourseUseCase
  implements UseCase<CreateCourseInputDto, CourseResponseDto>
{
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute(input: CreateCourseInputDto) {
    const course = await this.coursesRepository.create(Course.create(input));

    return {
      course: toCourseDto(course),
    };
  }
}
