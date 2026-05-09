export interface CreateCourseInputDto {
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  creatorId: string;
}
