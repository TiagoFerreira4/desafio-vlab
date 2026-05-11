import { useAuth } from "../../auth/auth-context";
import { CourseForm } from "../components/course-form";
import { CourseList } from "../components/course-list";
import { CourseSearch } from "../components/course-search";
import { CoursesEmptyState } from "../components/courses-empty-state";
import { useCourses } from "../use-courses";

export function CoursesDashboardPage() {
  const { token } = useAuth();
  const coursesState = useCourses(token);
  const hasSearch = coursesState.search.trim().length > 0;

  function handleDeleteCourse(courseId: string, courseName: string) {
    const shouldDelete = window.confirm(
      `Excluir o curso "${courseName}"? Esta acao nao pode ser desfeita.`,
    );

    if (!shouldDelete) {
      return;
    }

    const course = coursesState.courses.find(({ id }) => id === courseId);

    if (course) {
      void coursesState.deleteCourse(course);
    }
  }

  return (
    <main className="content-area">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Cursos</h1>
        </div>
      </section>

      <div className="dashboard-grid">
        <CourseForm
          course={coursesState.editingCourse}
          isSubmitting={coursesState.isCreating || coursesState.isSaving}
          onCancel={coursesState.cancelEditing}
          onSubmit={
            coursesState.editingCourse
              ? coursesState.saveCourse
              : coursesState.createCourse
          }
        />

        <section className="courses-panel" aria-labelledby="courses-title">
          <div className="courses-panel-header">
            <div>
              <p className="eyebrow">Meus cursos</p>
              <h2 id="courses-title">Lista de cursos</h2>
            </div>

            <span className="counter-badge">{coursesState.courses.length}</span>
          </div>

          <CourseSearch
            initialValue={coursesState.search}
            isLoading={coursesState.isLoading}
            onSearch={coursesState.submitSearch}
          />

          {coursesState.error ? (
            <div className="form-error" role="alert">
              {coursesState.error}
            </div>
          ) : null}

          {coursesState.isLoading ? (
            <section className="empty-state" aria-label="Carregando cursos">
              <h2>Carregando cursos...</h2>
            </section>
          ) : coursesState.courses.length > 0 ? (
            <CourseList
              courses={coursesState.courses}
              deletingCourseId={coursesState.deletingCourseId}
              editingCourseId={coursesState.editingCourse?.id}
              onDelete={(course) => handleDeleteCourse(course.id, course.name)}
              onEdit={coursesState.startEditing}
            />
          ) : (
            <CoursesEmptyState hasSearch={hasSearch} />
          )}
        </section>
      </div>
    </main>
  );
}
