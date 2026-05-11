import { CheckCircle2, Circle, Files } from "lucide-react";

import type { LessonStatusFilterValue } from "../types";

type LessonStatusFilterProps = {
  value: LessonStatusFilterValue;
  onChange: (value: LessonStatusFilterValue) => void;
};

const filters: Array<{ label: string; value: LessonStatusFilterValue }> = [
  { label: "Todos", value: "all" },
  { label: "Rascunhos", value: "draft" },
  { label: "Publicados", value: "published" },
];

const filterIcons = {
  all: Files,
  draft: Circle,
  published: CheckCircle2,
};

export function LessonStatusFilter({
  value,
  onChange,
}: LessonStatusFilterProps) {
  return (
    <div className="status-filter" aria-label="Filtrar aulas por status">
      {filters.map((filter) => {
        const Icon = filterIcons[filter.value];

        return (
          <button
            className={filter.value === value ? "is-active" : "secondary-button"}
            key={filter.value}
            onClick={() => onChange(filter.value)}
            type="button"
          >
            <Icon aria-hidden="true" size={18} />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
