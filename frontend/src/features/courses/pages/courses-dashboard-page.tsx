import { useSearchParams } from "react-router-dom";

import { useAuth } from "../../auth/auth-context";
import { CourseForm } from "../components/course-form";
import { CourseList } from "../components/course-list";
import { CourseSearch } from "../components/course-search";
import { CoursesEmptyState } from "../components/courses-empty-state";
import type { CourseFormInput, CourseScope } from "../types";
import { useCourses } from "../use-courses";

function parseCourseScope(value: string | null): CourseScope {
  return value === "all" ? "all" : "mine";
}

export function CoursesDashboardPage() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeScope = parseCourseScope(searchParams.get("tab"));
  const myCoursesState = useCourses(token, "mine");
  const allCoursesState = useCourses(token, "all");
  const coursesState =
    activeScope === "mine" ? myCoursesState : allCoursesState;
  const isMyCoursesTab = activeScope === "mine";
  const hasSearch = coursesState.search.trim().length > 0;

  function setActiveScope(scope: CourseScope) {
    setSearchParams(scope === "mine" ? {} : { tab: "all" });
  }

  async function handleCreateCourse(input: CourseFormInput) {
    await myCoursesState.createCourse(input);
    await allCoursesState.reloadCourses(allCoursesState.search);
  }

  async function handleSaveCourse(input: CourseFormInput) {
    await myCoursesState.saveCourse(input);
    await allCoursesState.reloadCourses(allCoursesState.search);
  }

  function handleDeleteCourse(courseId: string, courseName: string) {
    const shouldDelete = window.confirm(
      `Excluir o curso "${courseName}"? Esta acao nao pode ser desfeita.`,
    );

    if (!shouldDelete) {
      return;
    }

    const course = coursesState.courses.find(({ id }) => id === courseId);

    if (course) {
      void myCoursesState.deleteCourse(course).then(() =>
        allCoursesState.reloadCourses(allCoursesState.search),
      );
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

      <div className={isMyCoursesTab ? "dashboard-grid" : "dashboard-grid read-only-grid"}>
        {isMyCoursesTab ? (
          <CourseForm
            course={myCoursesState.editingCourse}
            isSubmitting={myCoursesState.isCreating || myCoursesState.isSaving}
            onCancel={myCoursesState.cancelEditing}
            onSubmit={
              myCoursesState.editingCourse
                ? handleSaveCourse
                : handleCreateCourse
            }
          />
        ) : null}

        <section className="courses-panel" aria-labelledby="courses-title">
          <div className="course-tabs" role="tablist" aria-label="Escopo dos cursos">
            <button
              aria-selected={activeScope === "mine"}
              className={activeScope === "mine" ? "course-tab active" : "course-tab"}
              onClick={() => setActiveScope("mine")}
              role="tab"
              type="button"
            >
              Meus cursos
            </button>
            <button
              aria-selected={activeScope === "all"}
              className={activeScope === "all" ? "course-tab active" : "course-tab"}
              onClick={() => setActiveScope("all")}
              role="tab"
              type="button"
            >
              Todos os cursos
            </button>
          </div>

          <div className="courses-panel-header">
            <div>
              <p className="eyebrow">
                {isMyCoursesTab ? "Meus cursos" : "Catalogo"}
              </p>
              <h2 id="courses-title">Lista de cursos</h2>
              {!isMyCoursesTab ? (
                <p className="panel-note">
                  Cursos da plataforma em modo leitura.
                </p>
              ) : null}
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
              canManage={isMyCoursesTab}
              courses={coursesState.courses}
              deletingCourseId={myCoursesState.deletingCourseId}
              editingCourseId={myCoursesState.editingCourse?.id}
              linkScope={activeScope}
              onDelete={(course) => handleDeleteCourse(course.id, course.name)}
              onEdit={myCoursesState.startEditing}
            />
          ) : (
            <CoursesEmptyState hasSearch={hasSearch} />
          )}
        </section>
      </div>
    </main>
  );
}
