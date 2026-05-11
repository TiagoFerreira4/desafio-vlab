export interface UpdateLessonInputDto {
  courseId: string;
  lessonId: string;
  title: string;
  status: string;
  videoUrl?: string | null;
  userId: string;
}
