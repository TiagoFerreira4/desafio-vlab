export interface CreateLessonInputDto {
  courseId: string;
  title: string;
  status: string;
  videoUrl?: string | null;
  userId: string;
}
