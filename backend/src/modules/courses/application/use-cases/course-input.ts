import { InvalidCourseDateError } from "../../domain/errors/invalid-course-date-error.js";
import { InvalidCourseNameError } from "../../domain/errors/invalid-course-name-error.js";

interface CourseInput {
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
}

export function normalizeCourseInput(input: CourseInput) {
  const name = input.name.trim();

  if (name.length < 3) {
    throw new InvalidCourseNameError();
  }

  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate < startDate
  ) {
    throw new InvalidCourseDateError();
  }

  const description = input.description?.trim() || null;

  return {
    name,
    description,
    startDate,
    endDate,
  };
}
