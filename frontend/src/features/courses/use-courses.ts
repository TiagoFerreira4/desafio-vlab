import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "../../shared/api/api-errors";
import * as coursesApi from "./courses-api";
import type { Course, CourseFormInput } from "./types";

export function useCourses(token: string | null) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(
    async (nextSearch = search) => {
      if (!token) {
        setCourses([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await coursesApi.listCourses(token, nextSearch);
        setCourses(response.courses);
      } catch (caughtError) {
        setError(getApiErrorMessage(caughtError));
      } finally {
        setIsLoading(false);
      }
    },
    [search, token],
  );

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  const submitSearch = useCallback(
    async (nextSearch: string) => {
      setSearch(nextSearch);
      await loadCourses(nextSearch);
    },
    [loadCourses],
  );

  const createCourse = useCallback(
    async (input: CourseFormInput) => {
      if (!token) {
        throw new Error("Sessao expirada. Faca login novamente.");
      }

      setIsCreating(true);
      setError(null);

      try {
        await coursesApi.createCourse(token, input);
        await loadCourses(search);
      } catch (caughtError) {
        throw new Error(getApiErrorMessage(caughtError));
      } finally {
        setIsCreating(false);
      }
    },
    [loadCourses, search, token],
  );

  const startEditing = useCallback((course: Course) => {
    setEditingCourse(course);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingCourse(null);
  }, []);

  const saveCourse = useCallback(
    async (input: CourseFormInput) => {
      if (!token || !editingCourse) {
        throw new Error("Sessao expirada. Faca login novamente.");
      }

      setIsSaving(true);
      setError(null);

      try {
        await coursesApi.updateCourse(token, editingCourse.id, input);
        setEditingCourse(null);
        await loadCourses(search);
      } catch (caughtError) {
        throw new Error(getApiErrorMessage(caughtError));
      } finally {
        setIsSaving(false);
      }
    },
    [editingCourse, loadCourses, search, token],
  );

  const deleteCourse = useCallback(
    async (course: Course) => {
      if (!token) {
        throw new Error("Sessao expirada. Faca login novamente.");
      }

      setDeletingCourseId(course.id);
      setError(null);

      try {
        await coursesApi.deleteCourse(token, course.id);

        if (editingCourse?.id === course.id) {
          setEditingCourse(null);
        }

        await loadCourses(search);
      } catch (caughtError) {
        setError(getApiErrorMessage(caughtError));
      } finally {
        setDeletingCourseId(null);
      }
    },
    [editingCourse, loadCourses, search, token],
  );

  return {
    courses,
    search,
    editingCourse,
    deletingCourseId,
    isLoading,
    isCreating,
    isSaving,
    error,
    cancelEditing,
    createCourse,
    deleteCourse,
    reloadCourses: loadCourses,
    saveCourse,
    startEditing,
    submitSearch,
  };
}
