import { useEffect, useState } from "react";

import { getGuestInstructor } from "./guest-instructor-api";
import type { GuestInstructor } from "./types";

export function useGuestInstructor(courseId: string | undefined) {
  const [instructor, setInstructor] = useState<GuestInstructor | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(courseId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setInstructor(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const currentCourseId = courseId;

    async function loadGuestInstructor() {
      setIsLoading(true);
      setError(null);
      setInstructor(null);

      try {
        const nextInstructor = await getGuestInstructor(
          currentCourseId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setInstructor(nextInstructor);
        }
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setInstructor(null);
        setError("Nao foi possivel carregar o instrutor convidado.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadGuestInstructor();

    return () => {
      controller.abort();
    };
  }, [courseId]);

  return {
    instructor,
    isLoading,
    error,
  };
}
