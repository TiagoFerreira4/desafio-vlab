import type { Course } from "../entities/course.js";

export interface FindManyCoursesInput {
  creatorId: string;
  search?: string;
}

export interface FindManyPublicCoursesInput {
  search?: string;
}

export interface CoursesRepository {
  findManyByCreatorId(input: FindManyCoursesInput): Promise<Course[]>;
  findMany(input: FindManyPublicCoursesInput): Promise<Course[]>;
  findById(id: string): Promise<Course | null>;
  create(course: Course): Promise<Course>;
  update(course: Course): Promise<Course>;
  delete(id: string): Promise<void>;
}
