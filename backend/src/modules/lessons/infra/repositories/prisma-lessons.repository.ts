import type { Lesson, PrismaClient } from "@prisma/client";
import { LessonStatus as PrismaLessonStatus } from "@prisma/client";

import {
  Lesson as LessonEntity,
  type LessonStatus,
} from "../../domain/entities/lesson.js";
import type { LessonsRepository } from "../../domain/repositories/lessons-repository.js";

function toPrismaLessonStatus(status: LessonStatus) {
  return status === "draft"
    ? PrismaLessonStatus.DRAFT
    : PrismaLessonStatus.PUBLISHED;
}

function toLessonStatus(status: PrismaLessonStatus): LessonStatus {
  return status === PrismaLessonStatus.DRAFT ? "draft" : "published";
}

function toLessonEntity(lesson: Lesson) {
  return LessonEntity.restore({
    id: lesson.id,
    title: lesson.title,
    status: toLessonStatus(lesson.status),
    videoUrl: lesson.videoUrl,
    courseId: lesson.courseId,
    createdAt: lesson.createdAt,
    updatedAt: lesson.updatedAt,
  });
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

    return lessons.map(toLessonEntity);
  }

  async findById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    return lesson ? toLessonEntity(lesson) : null;
  }

  async create(lesson: LessonEntity) {
    const createdLesson = await this.prisma.lesson.create({
      data: {
        title: lesson.title,
        status: toPrismaLessonStatus(lesson.status),
        videoUrl: lesson.videoUrl,
        courseId: lesson.courseId,
      },
    });

    return toLessonEntity(createdLesson);
  }

  async update(lesson: LessonEntity) {
    const updatedLesson = await this.prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: lesson.title,
        status: toPrismaLessonStatus(lesson.status),
        videoUrl: lesson.videoUrl,
      },
    });

    return toLessonEntity(updatedLesson);
  }

  async delete(id: string) {
    await this.prisma.lesson.delete({
      where: { id },
    });
  }
}
