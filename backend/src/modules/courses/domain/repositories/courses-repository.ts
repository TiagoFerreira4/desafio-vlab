export interface CourseRecord {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  name: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  creatorId: string;
}

export interface UpdateCourseInput {
  name: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
}

export interface CoursesRepository {
  findManyByCreatorId(creatorId: string): Promise<CourseRecord[]>;
  findById(id: string): Promise<CourseRecord | null>;
  create(input: CreateCourseInput): Promise<CourseRecord>;
  update(id: string, input: UpdateCourseInput): Promise<CourseRecord>;
  delete(id: string): Promise<void>;
}
