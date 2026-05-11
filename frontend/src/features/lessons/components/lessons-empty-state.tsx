import type { LessonStatusFilterValue } from "../types";

type LessonsEmptyStateProps = {
  statusFilter: LessonStatusFilterValue;
};

export function LessonsEmptyState({ statusFilter }: LessonsEmptyStateProps) {
  return (
    <section className="empty-state" aria-label="Aulas">
      <h2>
        {statusFilter === "all"
          ? "Nenhuma aula encontrada"
          : "Nenhuma aula encontrada para o filtro"}
      </h2>
      <p>
        {statusFilter === "all"
          ? "Crie a primeira aula usando o formulario ao lado."
          : "Altere o filtro ou crie uma aula com este status."}
      </p>
    </section>
  );
}
