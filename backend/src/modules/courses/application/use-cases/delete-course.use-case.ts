import type { UseCase } from "../../../../shared/application/use-case.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";
import { ensureCourseExists, ensureCourseOwner } from "./course-ownership.js";

export interface DeleteCourseInput {
  id: string;
  userId: string;
}

export class DeleteCourseUseCase implements UseCase<DeleteCourseInput, void> {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute(input: DeleteCourseInput) {
    const course = ensureCourseExists(
      await this.coursesRepository.findById(input.id),
    );

    ensureCourseOwner(course, input.userId);

    await this.coursesRepository.delete(input.id);
  }
}
