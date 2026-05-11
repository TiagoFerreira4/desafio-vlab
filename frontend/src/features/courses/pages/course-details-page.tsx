import { ArrowLeft } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { formatDate } from "../../../shared/utils/date-format";
import { useAuth } from "../../auth/auth-context";
import { GuestInstructorCard } from "../../guest-instructor/components/guest-instructor-card";
import { useGuestInstructor } from "../../guest-instructor/use-guest-instructor";
import { LessonForm } from "../../lessons/components/lesson-form";
import { LessonList } from "../../lessons/components/lesson-list";
import { LessonStatusFilter } from "../../lessons/components/lesson-status-filter";
import { LessonsEmptyState } from "../../lessons/components/lessons-empty-state";
import { useLessons } from "../../lessons/use-lessons";
import type { CourseScope } from "../types";
import { useCourseDetails } from "../use-course-details";

function parseCourseScope(value: string | null): CourseScope {
  return value === "all" ? "all" : "mine";
}

export function CourseDetailsPage() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const { token, user } = useAuth();
  const scope = parseCourseScope(searchParams.get("scope"));
  const courseState = useCourseDetails(courseId, token);
  const guestInstructorState = useGuestInstructor(courseId);
  const lessonsState = useLessons(courseId, token);
  const canManage =
    scope === "mine" &&
    Boolean(user && courseState.course?.creatorId === user.id);

  function handleDeleteLesson(lessonId: string, lessonTitle: string) {
    const shouldDelete = window.confirm(
      `Excluir a aula "${lessonTitle}"? Esta acao nao pode ser desfeita.`,
    );

    if (!shouldDelete) {
      return;
    }

    const lesson = lessonsState.lessons.find(({ id }) => id === lessonId);

    if (lesson) {
      void lessonsState.deleteLesson(lesson);
    }
  }

  return (
    <main className="content-area">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Detalhes do curso</p>
          <h1>{courseState.course?.name ?? "Curso"}</h1>
        </div>

        <Link
          className="button-link secondary-button"
          to={scope === "all" ? "/dashboard?tab=all" : "/dashboard"}
        >
          <ArrowLeft aria-hidden="true" size={18} />
          Voltar
        </Link>
      </section>

      {courseState.error ? (
        <div className="form-error" role="alert">
          {courseState.error}
        </div>
      ) : null}

      {courseState.isLoading ? (
        <section className="empty-state" aria-label="Carregando curso">
          <h2>Carregando curso...</h2>
        </section>
      ) : courseState.course ? (
        <>
          <section className="course-details-summary">
            <div>
              <p className="eyebrow">Curso</p>
              <h2>{courseState.course.name}</h2>
              <p>{courseState.course.description ?? "Sem descricao."}</p>
            </div>

            <dl className="course-meta">
              <div>
                <dt>Inicio</dt>
                <dd>{formatDate(courseState.course.startDate)}</dd>
              </div>
              <div>
                <dt>Termino</dt>
                <dd>{formatDate(courseState.course.endDate)}</dd>
              </div>
            </dl>
          </section>

          <GuestInstructorCard
            error={guestInstructorState.error}
            instructor={guestInstructorState.instructor}
            isLoading={guestInstructorState.isLoading}
          />

          <div
            className={
              canManage
                ? "dashboard-grid lessons-grid"
                : "dashboard-grid lessons-grid read-only-grid"
            }
          >
            {canManage ? (
              <LessonForm
                isSubmitting={lessonsState.isCreating || lessonsState.isSaving}
                lesson={lessonsState.editingLesson}
                onCancel={lessonsState.cancelEditing}
                onSubmit={
                  lessonsState.editingLesson
                    ? lessonsState.saveLesson
                    : lessonsState.createLesson
                }
              />
            ) : null}

            <section className="courses-panel" aria-labelledby="lessons-title">
              <div className="courses-panel-header">
                <div>
                  <p className="eyebrow">Aulas</p>
                  <h2 id="lessons-title">Lista de aulas</h2>
                  {!canManage ? (
                    <p className="panel-note">
                      Apenas aulas publicadas estao disponiveis.
                    </p>
                  ) : null}
                </div>

                <span className="counter-badge">
                  {lessonsState.filteredLessons.length}
                </span>
              </div>

              {canManage ? (
                <LessonStatusFilter
                  onChange={lessonsState.setStatusFilter}
                  value={lessonsState.statusFilter}
                />
              ) : null}

              {lessonsState.error ? (
                <div className="form-error" role="alert">
                  {lessonsState.error}
                </div>
              ) : null}

              {lessonsState.isLoading ? (
                <section className="empty-state" aria-label="Carregando aulas">
                  <h2>Carregando aulas...</h2>
                </section>
              ) : lessonsState.filteredLessons.length > 0 ? (
                <LessonList
                  canManage={canManage}
                  deletingLessonId={lessonsState.deletingLessonId}
                  editingLessonId={lessonsState.editingLesson?.id}
                  lessons={lessonsState.filteredLessons}
                  onDelete={(lesson) =>
                    handleDeleteLesson(lesson.id, lesson.title)
                  }
                  onEdit={lessonsState.startEditing}
                />
              ) : (
                <LessonsEmptyState statusFilter={lessonsState.statusFilter} />
              )}
            </section>
          </div>
        </>
      ) : null}
    </main>
  );
}
