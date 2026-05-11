import { InvalidCourseDateError } from "../errors/invalid-course-date-error.js";
import { InvalidCourseNameError } from "../errors/invalid-course-name-error.js";

interface CourseProps {
  id: string | null;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  creatorId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CourseCreateProps {
  name: string;
  description?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  creatorId: string;
}

interface CourseRestoreProps extends CourseCreateProps {
  id: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseUpdateProps {
  name: string;
  description?: string | null;
  startDate: string | Date;
  endDate: string | Date;
}

function normalizeCourseProps(input: CourseUpdateProps) {
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

  return {
    name,
    description: input.description?.trim() || null,
    startDate,
    endDate,
  };
}

export class Course {
  private constructor(private props: CourseProps) {}

  static create(input: CourseCreateProps) {
    return new Course({
      id: null,
      ...normalizeCourseProps(input),
      creatorId: input.creatorId,
      createdAt: null,
      updatedAt: null,
    });
  }

  static restore(input: CourseRestoreProps) {
    return new Course({
      id: input.id,
      ...normalizeCourseProps(input),
      creatorId: input.creatorId,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }

  update(input: CourseUpdateProps) {
    this.props = {
      ...this.props,
      ...normalizeCourseProps(input),
    };
  }

  isCreatedBy(userId: string) {
    return this.creatorId === userId;
  }

  get id() {
    if (!this.props.id) {
      throw new Error("Course id is not set.");
    }

    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get creatorId() {
    return this.props.creatorId;
  }

  get createdAt() {
    if (!this.props.createdAt) {
      throw new Error("Course createdAt is not set.");
    }

    return this.props.createdAt;
  }

  get updatedAt() {
    if (!this.props.updatedAt) {
      throw new Error("Course updatedAt is not set.");
    }

    return this.props.updatedAt;
  }
}
