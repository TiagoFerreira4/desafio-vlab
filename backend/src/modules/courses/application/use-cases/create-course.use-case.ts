import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CourseResponseDto } from "../dto/course.dto.js";
import { toCourseDto } from "../dto/course.dto.js";
import type { CreateCourseInputDto } from "../dto/create-course.dto.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";
import { normalizeCourseInput } from "./course-input.js";

export class CreateCourseUseCase
  implements UseCase<CreateCourseInputDto, CourseResponseDto>
{
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute(input: CreateCourseInputDto) {
    const courseInput = normalizeCourseInput(input);

    const course = await this.coursesRepository.create({
      ...courseInput,
      creatorId: input.creatorId,
    });

    return {
      course: toCourseDto(course),
    };
  }
}
