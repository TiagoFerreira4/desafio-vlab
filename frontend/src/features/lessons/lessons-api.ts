import { apiRequest } from "../../shared/api/api-client";
import type {
  LessonBody,
  LessonFormInput,
  LessonListResponse,
  LessonResponse,
} from "./types";

function toLessonBody(input: LessonFormInput): LessonBody {
  const videoUrl = input.videoUrl.trim();

  return {
    title: input.title.trim(),
    status: input.status,
    videoUrl: videoUrl.length > 0 ? videoUrl : null,
  };
}

export function listLessons(token: string, courseId: string) {
  return apiRequest<LessonListResponse>(`/courses/${courseId}/lessons/`, {
    token,
  });
}

export function createLesson(
  token: string,
  courseId: string,
  input: LessonFormInput,
) {
  return apiRequest<LessonResponse>(`/courses/${courseId}/lessons/`, {
    method: "POST",
    token,
    body: toLessonBody(input),
  });
}

export function updateLesson(
  token: string,
  courseId: string,
  lessonId: string,
  input: LessonFormInput,
) {
  return apiRequest<LessonResponse>(
    `/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "PUT",
      token,
      body: toLessonBody(input),
    },
  );
}

export function deleteLesson(
  token: string,
  courseId: string,
  lessonId: string,
) {
  return apiRequest<void>(`/courses/${courseId}/lessons/${lessonId}`, {
    method: "DELETE",
    token,
  });
}
