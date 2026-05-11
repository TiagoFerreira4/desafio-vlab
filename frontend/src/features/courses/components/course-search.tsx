import { FormEvent, useState } from "react";

type CourseSearchProps = {
  initialValue: string;
  isLoading: boolean;
  onSearch: (search: string) => Promise<void>;
};

export function CourseSearch({
  initialValue,
  isLoading,
  onSearch,
}: CourseSearchProps) {
  const [search, setSearch] = useState(initialValue);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSearch(search);
  }

  async function handleClear() {
    setSearch("");
    await onSearch("");
  }

  return (
    <form className="course-search" onSubmit={handleSubmit}>
      <label>
        Buscar curso
        <input
          name="search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nome do curso"
          type="search"
          value={search}
        />
      </label>

      <div className="course-search-actions">
        <button disabled={isLoading} type="submit">
          Buscar
        </button>
        <button
          className="secondary-button"
          disabled={isLoading || search.length === 0}
          onClick={handleClear}
          type="button"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
