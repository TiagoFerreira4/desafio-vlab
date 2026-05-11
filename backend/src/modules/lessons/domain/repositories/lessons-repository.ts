export type LessonStatus = "draft" | "published";

export interface LessonRecord {
  id: string;
  title: string;
  status: LessonStatus;
  videoUrl: string | null;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonInput {
  title: string;
  status: LessonStatus;
  videoUrl?: string | null;
  courseId: string;
}

export interface UpdateLessonInput {
  title: string;
  status: LessonStatus;
  videoUrl?: string | null;
}

export interface LessonsRepository {
  findManyByCourseId(courseId: string): Promise<LessonRecord[]>;
  findById(id: string): Promise<LessonRecord | null>;
  create(input: CreateLessonInput): Promise<LessonRecord>;
  update(id: string, input: UpdateLessonInput): Promise<LessonRecord>;
  delete(id: string): Promise<void>;
}
