import { Course } from "../../domain/entities/course.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";

interface CreateCourseTestInput {
  name: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  creatorId: string;
}

export class InMemoryCoursesRepository implements CoursesRepository {
  public readonly items = new Map<string, Course>();

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

  async create(input: Course | CreateCourseTestInput) {
    const course = input instanceof Course ? input : Course.create(input);
    const now = new Date("2026-05-09T12:00:00.000Z");
    const persistedCourse = Course.restore({
      id: `course-${this.items.size + 1}`,
      name: course.name,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
      creatorId: course.creatorId,
      createdAt: now,
      updatedAt: now,
    });

    this.items.set(persistedCourse.id, persistedCourse);

    return persistedCourse;
  }

  async update(course: Course) {
    const current = this.items.get(course.id);

    if (!current) {
      throw new Error("Course not found.");
    }

    const persistedCourse = Course.restore({
      id: current.id,
      name: course.name,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
      creatorId: current.creatorId,
      createdAt: current.createdAt,
      updatedAt: new Date("2026-05-09T13:00:00.000Z"),
    });

    this.items.set(persistedCourse.id, persistedCourse);

    return persistedCourse;
  }

  async delete(id: string) {
    this.items.delete(id);
  }
}
