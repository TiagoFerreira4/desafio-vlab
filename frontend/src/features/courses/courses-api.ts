import { apiRequest } from "../../shared/api/api-client";
import type {
  CourseBody,
  CourseFormInput,
  CourseListResponse,
  CourseResponse,
  CourseScope,
} from "./types";

function toCourseBody(input: CourseFormInput): CourseBody {
  const description = input.description.trim();

  return {
    name: input.name.trim(),
    description: description.length > 0 ? description : null,
    startDate: input.startDate,
    endDate: input.endDate,
  };
}

export function listCourses(
  token: string,
  input: { scope: CourseScope; search?: string },
) {
  const params = new URLSearchParams({
    scope: input.scope,
  });
  const trimmedSearch = input.search?.trim();

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  }

  return apiRequest<CourseListResponse>(`/courses?${params.toString()}`, {
    token,
  });
}

export function getCourse(token: string, courseId: string) {
  return apiRequest<CourseResponse>(`/courses/${courseId}`, {
    token,
  });
}

export function createCourse(token: string, input: CourseFormInput) {
  return apiRequest<CourseResponse>("/courses", {
    method: "POST",
    token,
    body: toCourseBody(input),
  });
}

export function updateCourse(
  token: string,
  courseId: string,
  input: CourseFormInput,
) {
  return apiRequest<CourseResponse>(`/courses/${courseId}`, {
    method: "PUT",
    token,
    body: toCourseBody(input),
  });
}

export function deleteCourse(token: string, courseId: string) {
  return apiRequest<void>(`/courses/${courseId}`, {
    method: "DELETE",
    token,
  });
}
