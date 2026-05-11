import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CourseListResponseDto } from "../dto/course.dto.js";
import { toCourseDto } from "../dto/course.dto.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";

export type CourseListScope = "mine" | "all";

export interface ListCoursesInput {
  creatorId: string;
  scope?: CourseListScope;
  search?: string;
}

export class ListCoursesUseCase
  implements UseCase<ListCoursesInput, CourseListResponseDto>
{
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute(input: ListCoursesInput) {
    const search = input.search?.trim() || undefined;
    const scope = input.scope ?? "mine";

    const courses =
      scope === "all"
        ? await this.coursesRepository.findMany({ search })
        : await this.coursesRepository.findManyByCreatorId({
            creatorId: input.creatorId,
            search,
          });

    return {
      courses: courses.map(toCourseDto),
    };
  }
}
