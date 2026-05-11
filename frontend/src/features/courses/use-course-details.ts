import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "../../shared/api/api-errors";
import * as coursesApi from "./courses-api";
import type { Course } from "./types";

export function useCourseDetails(courseId: string | undefined, token: string | null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    if (!token || !courseId) {
      setCourse(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await coursesApi.getCourse(token, courseId);
      setCourse(response.course);
    } catch (caughtError) {
      setCourse(null);
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  return {
    course,
    error,
    isLoading,
    reloadCourse: loadCourse,
  };
}
