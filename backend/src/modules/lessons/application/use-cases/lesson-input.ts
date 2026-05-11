import { InvalidLessonStatusError } from "../../domain/errors/invalid-lesson-status-error.js";
import { InvalidLessonTitleError } from "../../domain/errors/invalid-lesson-title-error.js";
import { InvalidLessonVideoUrlError } from "../../domain/errors/invalid-lesson-video-url-error.js";
import type { LessonStatus } from "../../domain/repositories/lessons-repository.js";

interface LessonInput {
  title: string;
  status: string;
  videoUrl?: string | null;
}

function normalizeLessonStatus(status: string): LessonStatus {
  if (status === "draft" || status === "published") {
    return status;
  }

  throw new InvalidLessonStatusError();
}

function normalizeVideoUrl(videoUrl?: string | null) {
  const trimmedVideoUrl = videoUrl?.trim();

  if (!trimmedVideoUrl) {
    return null;
  }

  try {
    new URL(trimmedVideoUrl);
  } catch {
    throw new InvalidLessonVideoUrlError();
  }

  return trimmedVideoUrl;
}

export function normalizeLessonInput(input: LessonInput) {
  const title = input.title.trim();

  if (title.length < 3) {
    throw new InvalidLessonTitleError();
  }

  return {
    title,
    status: normalizeLessonStatus(input.status),
    videoUrl: normalizeVideoUrl(input.videoUrl),
  };
}
