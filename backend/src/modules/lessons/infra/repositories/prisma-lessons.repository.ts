import type { Lesson, PrismaClient } from "@prisma/client";
import { LessonStatus as PrismaLessonStatus } from "@prisma/client";

import type {
  CreateLessonInput,
  LessonRecord,
  LessonStatus,
  LessonsRepository,
  UpdateLessonInput,
} from "../../domain/repositories/lessons-repository.js";

function toPrismaLessonStatus(status: LessonStatus) {
  return status === "draft"
    ? PrismaLessonStatus.DRAFT
    : PrismaLessonStatus.PUBLISHED;
}

function toLessonStatus(status: PrismaLessonStatus): LessonStatus {
  return status === PrismaLessonStatus.DRAFT ? "draft" : "published";
}

function toLessonRecord(lesson: Lesson): LessonRecord {
  return {
    id: lesson.id,
    title: lesson.title,
    status: toLessonStatus(lesson.status),
    videoUrl: lesson.videoUrl,
    courseId: lesson.courseId,
    createdAt: lesson.createdAt,
    updatedAt: lesson.updatedAt,
  };
}

export class PrismaLessonsRepository implements LessonsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findManyByCourseId(courseId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: {
        createdAt: "asc",
      },
    });

    return lessons.map(toLessonRecord);
  }

  async findById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    return lesson ? toLessonRecord(lesson) : null;
  }

  async create(input: CreateLessonInput) {
    const lesson = await this.prisma.lesson.create({
      data: {
        title: input.title,
        status: toPrismaLessonStatus(input.status),
        videoUrl: input.videoUrl,
        courseId: input.courseId,
      },
    });

    return toLessonRecord(lesson);
  }

  async update(id: string, input: UpdateLessonInput) {
    const lesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        title: input.title,
        status: toPrismaLessonStatus(input.status),
        videoUrl: input.videoUrl,
      },
    });

    return toLessonRecord(lesson);
  }

  async delete(id: string) {
    await this.prisma.lesson.delete({
      where: { id },
    });
  }
}
