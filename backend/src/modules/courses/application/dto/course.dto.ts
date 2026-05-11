import type { Course } from "../../domain/entities/course.js";

export interface CourseDto {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseResponseDto {
  course: CourseDto;
}

export interface CourseListResponseDto {
  courses: CourseDto[];
}

export function toCourseDto(course: Course): CourseDto {
  return {
    id: course.id,
    name: course.name,
    description: course.description,
    startDate: course.startDate.toISOString(),
    endDate: course.endDate.toISOString(),
    creatorId: course.creatorId,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  };
}
