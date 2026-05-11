import type { Course, PrismaClient } from "@prisma/client";

import { Course as CourseEntity } from "../../domain/entities/course.js";
import type { CoursesRepository } from "../../domain/repositories/courses-repository.js";

function toCourseEntity(course: Course) {
  return CourseEntity.restore({
    id: course.id,
    name: course.name,
    description: course.description,
    startDate: course.startDate,
    endDate: course.endDate,
    creatorId: course.creatorId,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  });
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

    return courses.map(toCourseEntity);
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    return course ? toCourseEntity(course) : null;
  }

  async create(course: CourseEntity) {
    const createdCourse = await this.prisma.course.create({
      data: {
        name: course.name,
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
        creatorId: course.creatorId,
      },
    });

    return toCourseEntity(createdCourse);
  }

  async update(course: CourseEntity) {
    const updatedCourse = await this.prisma.course.update({
      where: { id: course.id },
      data: {
        name: course.name,
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
      },
    });

    return toCourseEntity(updatedCourse);
  }

  async delete(id: string) {
    await this.prisma.course.delete({
      where: { id },
    });
  }
}
