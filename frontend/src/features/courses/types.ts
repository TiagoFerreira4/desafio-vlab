export type Course = {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseListResponse = {
  courses: Course[];
};

export type CourseResponse = {
  course: Course;
};

export type CourseFormInput = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
};

export type CourseBody = {
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
};
