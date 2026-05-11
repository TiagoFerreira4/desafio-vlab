import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CourseResponseDto } from "../dto/course.dto.js";
import { toCourseDto } from "../dto/course.dto.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";
import { ensureCourseExists } from "./course-ownership.js";

export interface GetCourseInput {
  id: string;
}

export class GetCourseUseCase implements UseCase<GetCourseInput, CourseResponseDto> {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute(input: GetCourseInput) {
    const course = ensureCourseExists(
      await this.coursesRepository.findById(input.id),
    );

    return {
      course: toCourseDto(course),
    };
  }
}
