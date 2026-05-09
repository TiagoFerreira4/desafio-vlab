export interface UpdateCourseInputDto {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  userId: string;
}
