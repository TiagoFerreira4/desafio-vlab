import type {
  CourseRecord,
  CoursesRepository,
  CreateCourseInput,
  UpdateCourseInput,
} from "../../domain/repositories/courses-repository.js";

export class InMemoryCoursesRepository implements CoursesRepository {
  public readonly items = new Map<string, CourseRecord>();

  async findManyByCreatorId(input: { creatorId: string; search?: string }) {
    const search = input.search?.toLowerCase();

    return [...this.items.values()].filter((course) => {
      const belongsToCreator = course.creatorId === input.creatorId;
      const matchesSearch =
        !search || course.name.toLowerCase().includes(search);

      return belongsToCreator && matchesSearch;
    });
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async create(input: CreateCourseInput) {
    const now = new Date("2026-05-09T12:00:00.000Z");
    const course: CourseRecord = {
      id: `course-${this.items.size + 1}`,
      name: input.name,
      description: input.description ?? null,
      startDate: input.startDate,
      endDate: input.endDate,
      creatorId: input.creatorId,
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(course.id, course);

    return course;
  }

  async update(id: string, input: UpdateCourseInput) {
    const current = this.items.get(id);

    if (!current) {
      throw new Error("Course not found.");
    }

    const course: CourseRecord = {
      ...current,
      name: input.name,
      description: input.description ?? null,
      startDate: input.startDate,
      endDate: input.endDate,
      updatedAt: new Date("2026-05-09T13:00:00.000Z"),
    };

    this.items.set(id, course);

    return course;
  }

  async delete(id: string) {
    this.items.delete(id);
  }
}
