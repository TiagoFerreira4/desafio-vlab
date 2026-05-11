type CoursesEmptyStateProps = {
  hasSearch: boolean;
};

export function CoursesEmptyState({ hasSearch }: CoursesEmptyStateProps) {
  return (
    <section className="empty-state" aria-label="Cursos">
      <h2>
        {hasSearch
          ? "Nenhum curso encontrado para a busca"
          : "Nenhum curso encontrado"}
      </h2>
      <p>
        {hasSearch
          ? "Limpe a busca ou tente outro nome."
          : "Crie o primeiro curso usando o formulario ao lado."}
      </p>
    </section>
  );
}
