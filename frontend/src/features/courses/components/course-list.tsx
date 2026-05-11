import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { formatDate } from "../../../shared/utils/date-format";
import type { Course } from "../types";

type CourseListProps = {
  courses: Course[];
  deletingCourseId?: string | null;
  editingCourseId?: string | null;
  onDelete: (course: Course) => void;
  onEdit: (course: Course) => void;
};

export function CourseList({
  courses,
  deletingCourseId,
  editingCourseId,
  onDelete,
  onEdit,
}: CourseListProps) {
  return (
    <section className="course-list" aria-label="Cursos cadastrados">
      {courses.map((course) => {
        const isEditing = editingCourseId === course.id;
        const isDeleting = deletingCourseId === course.id;

        return (
          <article
            className={`course-card${isEditing ? " is-editing" : ""}`}
            key={course.id}
          >
            <div>
              {isEditing ? <span className="status-pill">Em edicao</span> : null}
              <h2>{course.name}</h2>
              <p>{course.description ?? "Sem descricao."}</p>
            </div>

            <dl className="course-meta">
              <div>
                <dt>Inicio</dt>
                <dd>{formatDate(course.startDate)}</dd>
              </div>
              <div>
                <dt>Termino</dt>
                <dd>{formatDate(course.endDate)}</dd>
              </div>
            </dl>

            <div className="course-card-actions">
              <Link
                className="button-link secondary-button"
                to={`/courses/${course.id}`}
              >
                <Eye aria-hidden="true" size={18} />
                Ver aulas
              </Link>

              <button
                className={isEditing ? "editing-button" : "secondary-button"}
                disabled={isEditing || isDeleting}
                onClick={() => onEdit(course)}
                type="button"
              >
                <Pencil aria-hidden="true" size={18} />
                {isEditing ? "Editando" : "Editar"}
              </button>

              <button
                className="danger-button"
                disabled={isDeleting}
                onClick={() => onDelete(course)}
                type="button"
              >
                <Trash2 aria-hidden="true" size={18} />
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
