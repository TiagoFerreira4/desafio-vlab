import type { Course, PrismaClient } from "@prisma/client";

import type {
  CourseRecord,
  CoursesRepository,
  CreateCourseInput,
  UpdateCourseInput,
} from "../../domain/repositories/courses-repository.js";

function toCourseRecord(course: Course): CourseRecord {
  return {
    id: course.id,
    name: course.name,
    description: course.description,
    startDate: course.startDate,
    endDate: course.endDate,
    creatorId: course.creatorId,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

export class PrismaCoursesRepository implements CoursesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findManyByCreatorId(input: { creatorId: string; search?: string }) {
    const courses = await this.prisma.course.findMany({
      where: {
        creatorId: input.creatorId,
        ...(input.search
          ? {
              name: {
                contains: input.search,
                mode: "insensitive" as const,
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return courses.map(toCourseRecord);
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    return course ? toCourseRecord(course) : null;
  }

  async create(input: CreateCourseInput) {
    const course = await this.prisma.course.create({
      data: {
        name: input.name,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
        creatorId: input.creatorId,
      },
    });

    return toCourseRecord(course);
  }

  async update(id: string, input: UpdateCourseInput) {
    const course = await this.prisma.course.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
      },
    });

    return toCourseRecord(course);
  }

  async delete(id: string) {
    await this.prisma.course.delete({
      where: { id },
    });
  }
}
