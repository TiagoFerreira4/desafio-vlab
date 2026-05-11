import { FormEvent, useEffect, useState } from "react";

import { toDateInputValue } from "../../../shared/utils/date-format";
import type { Course } from "../types";
import type { CourseFormInput } from "../types";

const initialFormState: CourseFormInput = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
};

type CourseFormProps = {
  course?: Course | null;
  isSubmitting: boolean;
  onCancel?: () => void;
  onSubmit: (input: CourseFormInput) => Promise<void>;
};

function validateCourseForm(input: CourseFormInput) {
  if (input.name.trim().length < 3) {
    return "O nome precisa ter pelo menos 3 caracteres.";
  }

  if (!input.startDate || !input.endDate) {
    return "Informe as datas de inicio e termino.";
  }

  if (input.endDate < input.startDate) {
    return "A data de termino deve ser igual ou posterior a data de inicio.";
  }

  return null;
}

function toFormState(course?: Course | null): CourseFormInput {
  if (!course) {
    return initialFormState;
  }

  return {
    name: course.name,
    description: course.description ?? "",
    startDate: toDateInputValue(course.startDate),
    endDate: toDateInputValue(course.endDate),
  };
}

export function CourseForm({
  course,
  isSubmitting,
  onCancel,
  onSubmit,
}: CourseFormProps) {
  const [form, setForm] = useState<CourseFormInput>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(course);

  useEffect(() => {
    setForm(toFormState(course));
    setError(null);
  }, [course]);

  function updateField(field: keyof CourseFormInput, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateCourseForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSubmit(form);
      if (!isEditing) {
        setForm(initialFormState);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Nao foi possivel salvar o curso.",
      );
    }
  }

  return (
    <section
      className={`course-form-panel${isEditing ? " is-editing" : ""}`}
      aria-labelledby="course-form-title"
    >
      <div className="course-form-heading">
        <p className="eyebrow">{isEditing ? "Editar curso" : "Novo curso"}</p>
        <h2 id="course-form-title">
          {isEditing ? "Salvar alteracoes" : "Criar curso"}
        </h2>
        {isEditing ? (
          <p className="editing-note">
            Voce esta editando {course?.name}. Salve ou cancele para voltar a
            criacao.
          </p>
        ) : null}
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            type="text"
            value={form.name}
          />
        </label>

        <label>
          Descricao
          <textarea
            name="description"
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            rows={4}
            value={form.description}
          />
        </label>

        <div className="form-grid">
          <label>
            Inicio
            <input
              name="startDate"
              onChange={(event) =>
                updateField("startDate", event.target.value)
              }
              type="date"
              value={form.startDate}
            />
          </label>

          <label>
            Termino
            <input
              name="endDate"
              onChange={(event) => updateField("endDate", event.target.value)}
              type="date"
              value={form.endDate}
            />
          </label>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          <button disabled={isSubmitting} type="submit">
            {isSubmitting
              ? isEditing
                ? "Salvando..."
                : "Criando..."
              : isEditing
                ? "Salvar alteracoes"
                : "Criar curso"}
          </button>

          {isEditing ? (
            <button
              className="secondary-button"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
