export type LessonStatus = "draft" | "published";

export type Lesson = {
  id: string;
  title: string;
  status: LessonStatus;
  videoUrl: string | null;
  courseId: string;
  createdAt: string;
  updatedAt: string;
};

export type LessonListResponse = {
  lessons: Lesson[];
};

export type LessonResponse = {
  lesson: Lesson;
};

export type LessonFormInput = {
  title: string;
  status: LessonStatus;
  videoUrl: string;
};

export type LessonBody = {
  title: string;
  status: LessonStatus;
  videoUrl?: string | null;
};

export type LessonStatusFilterValue = "all" | LessonStatus;
