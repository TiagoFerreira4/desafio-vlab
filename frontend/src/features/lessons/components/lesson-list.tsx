import { Pencil, PlayCircle, Trash2 } from "lucide-react";

import { formatDate } from "../../../shared/utils/date-format";
import type { Lesson } from "../types";

const statusLabels: Record<Lesson["status"], string> = {
  draft: "Rascunho",
  published: "Publicado",
};

type LessonListProps = {
  canManage: boolean;
  lessons: Lesson[];
  deletingLessonId?: string | null;
  editingLessonId?: string | null;
  onDelete?: (lesson: Lesson) => void;
  onEdit?: (lesson: Lesson) => void;
};

export function LessonList({
  canManage,
  lessons,
  deletingLessonId,
  editingLessonId,
  onDelete,
  onEdit,
}: LessonListProps) {
  return (
    <section className="course-list" aria-label="Aulas cadastradas">
      {lessons.map((lesson) => {
        const isEditing = editingLessonId === lesson.id;
        const isDeleting = deletingLessonId === lesson.id;

        return (
          <article
            className={`course-card lesson-card${isEditing ? " is-editing" : ""}`}
            key={lesson.id}
          >
            <div>
              {isEditing ? <span className="status-pill">Em edicao</span> : null}
              <h2>{lesson.title}</h2>
              <p>
                {lesson.videoUrl ? (
                  <a href={lesson.videoUrl} rel="noreferrer" target="_blank">
                    <PlayCircle aria-hidden="true" size={17} />
                    Abrir video
                  </a>
                ) : (
                  "Sem video."
                )}
              </p>
            </div>

            <dl className="course-meta">
              <div>
                <dt>Status</dt>
                <dd>{statusLabels[lesson.status]}</dd>
              </div>
              <div>
                <dt>Atualizada</dt>
                <dd>{formatDate(lesson.updatedAt)}</dd>
              </div>
            </dl>

            {canManage && onEdit && onDelete ? (
              <div className="course-card-actions">
                <button
                  className={isEditing ? "editing-button" : "secondary-button"}
                  disabled={isEditing || isDeleting}
                  onClick={() => onEdit(lesson)}
                  type="button"
                >
                  <Pencil aria-hidden="true" size={18} />
                  {isEditing ? "Editando" : "Editar"}
                </button>

                <button
                  className="danger-button"
                  disabled={isDeleting}
                  onClick={() => onDelete(lesson)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={18} />
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
