import { useCallback, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "../../shared/api/api-errors";
import * as lessonsApi from "./lessons-api";
import type {
  Lesson,
  LessonFormInput,
  LessonStatusFilterValue,
} from "./types";

export function useLessons(courseId: string | undefined, token: string | null) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<LessonStatusFilterValue>("all");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredLessons = useMemo(() => {
    if (statusFilter === "all") {
      return lessons;
    }

    return lessons.filter((lesson) => lesson.status === statusFilter);
  }, [lessons, statusFilter]);

  const loadLessons = useCallback(async () => {
    if (!token || !courseId) {
      setLessons([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await lessonsApi.listLessons(token, courseId);
      setLessons(response.lessons);
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    void loadLessons();
  }, [loadLessons]);

  const createLesson = useCallback(
    async (input: LessonFormInput) => {
      if (!token || !courseId) {
        throw new Error("Sessao expirada. Faca login novamente.");
      }

      setIsCreating(true);
      setError(null);

      try {
        await lessonsApi.createLesson(token, courseId, input);
        await loadLessons();
      } catch (caughtError) {
        throw new Error(getApiErrorMessage(caughtError));
      } finally {
        setIsCreating(false);
      }
    },
    [courseId, loadLessons, token],
  );

  const startEditing = useCallback((lesson: Lesson) => {
    setEditingLesson(lesson);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingLesson(null);
  }, []);

  const saveLesson = useCallback(
    async (input: LessonFormInput) => {
      if (!token || !courseId || !editingLesson) {
        throw new Error("Sessao expirada. Faca login novamente.");
      }

      setIsSaving(true);
      setError(null);

      try {
        await lessonsApi.updateLesson(token, courseId, editingLesson.id, input);
        setEditingLesson(null);
        await loadLessons();
      } catch (caughtError) {
        throw new Error(getApiErrorMessage(caughtError));
      } finally {
        setIsSaving(false);
      }
    },
    [courseId, editingLesson, loadLessons, token],
  );

  const deleteLesson = useCallback(
    async (lesson: Lesson) => {
      if (!token || !courseId) {
        throw new Error("Sessao expirada. Faca login novamente.");
      }

      setDeletingLessonId(lesson.id);
      setError(null);

      try {
        await lessonsApi.deleteLesson(token, courseId, lesson.id);

        if (editingLesson?.id === lesson.id) {
          setEditingLesson(null);
        }

        await loadLessons();
      } catch (caughtError) {
        setError(getApiErrorMessage(caughtError));
      } finally {
        setDeletingLessonId(null);
      }
    },
    [courseId, editingLesson, loadLessons, token],
  );

  return {
    lessons,
    filteredLessons,
    statusFilter,
    editingLesson,
    deletingLessonId,
    isLoading,
    isCreating,
    isSaving,
    error,
    cancelEditing,
    createLesson,
    deleteLesson,
    reloadLessons: loadLessons,
    saveLesson,
    setStatusFilter,
    startEditing,
  };
}
