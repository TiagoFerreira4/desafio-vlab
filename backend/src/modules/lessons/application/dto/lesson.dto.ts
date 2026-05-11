import type { LessonRecord } from "../../domain/repositories/lessons-repository.js";

export interface LessonDto {
  id: string;
  title: string;
  status: string;
  videoUrl: string | null;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResponseDto {
  lesson: LessonDto;
}

export interface LessonListResponseDto {
  lessons: LessonDto[];
}

export function toLessonDto(lesson: LessonRecord): LessonDto {
  return {
    id: lesson.id,
    title: lesson.title,
    status: lesson.status,
    videoUrl: lesson.videoUrl,
    courseId: lesson.courseId,
    createdAt: lesson.createdAt.toISOString(),
    updatedAt: lesson.updatedAt.toISOString(),
  };
}
