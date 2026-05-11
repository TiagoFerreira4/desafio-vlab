import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CourseResponseDto } from "../dto/course.dto.js";
import { toCourseDto } from "../dto/course.dto.js";
import type { UpdateCourseInputDto } from "../dto/update-course.dto.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";
import { ensureCourseExists, ensureCourseOwner } from "./course-ownership.js";

export class UpdateCourseUseCase
  implements UseCase<UpdateCourseInputDto, CourseResponseDto>
{
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute(input: UpdateCourseInputDto) {
    const existingCourse = ensureCourseExists(
      await this.coursesRepository.findById(input.id),
    );

    ensureCourseOwner(existingCourse, input.userId);
    existingCourse.update(input);

    const course = await this.coursesRepository.update(existingCourse);

    return {
      course: toCourseDto(course),
    };
  }
}
