import { InvalidLessonStatusError } from "../errors/invalid-lesson-status-error.js";
import { InvalidLessonTitleError } from "../errors/invalid-lesson-title-error.js";
import { InvalidLessonVideoUrlError } from "../errors/invalid-lesson-video-url-error.js";

export type LessonStatus = "draft" | "published";

interface LessonProps {
  id: string | null;
  title: string;
  status: LessonStatus;
  videoUrl: string | null;
  courseId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface LessonCreateProps {
  title: string;
  status: string;
  videoUrl?: string | null;
  courseId: string;
}

interface LessonRestoreProps extends LessonCreateProps {
  id: string;
  status: LessonStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface LessonUpdateProps {
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

function normalizeLessonProps(input: LessonUpdateProps) {
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

export class Lesson {
  private constructor(private props: LessonProps) {}

  static create(input: LessonCreateProps) {
    return new Lesson({
      id: null,
      ...normalizeLessonProps(input),
      courseId: input.courseId,
      createdAt: null,
      updatedAt: null,
    });
  }

  static restore(input: LessonRestoreProps) {
    return new Lesson({
      id: input.id,
      ...normalizeLessonProps(input),
      courseId: input.courseId,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }

  update(input: LessonUpdateProps) {
    this.props = {
      ...this.props,
      ...normalizeLessonProps(input),
    };
  }

  belongsToCourse(courseId: string) {
    return this.courseId === courseId;
  }

  get id() {
    if (!this.props.id) {
      throw new Error("Lesson id is not set.");
    }

    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get status() {
    return this.props.status;
  }

  get videoUrl() {
    return this.props.videoUrl;
  }

  get courseId() {
    return this.props.courseId;
  }

  get createdAt() {
    if (!this.props.createdAt) {
      throw new Error("Lesson createdAt is not set.");
    }

    return this.props.createdAt;
  }

  get updatedAt() {
    if (!this.props.updatedAt) {
      throw new Error("Lesson updatedAt is not set.");
    }

    return this.props.updatedAt;
  }
}
