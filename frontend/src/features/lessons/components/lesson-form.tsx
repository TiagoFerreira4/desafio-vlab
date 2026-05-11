import { FormEvent, useEffect, useState } from "react";

import type { Lesson, LessonFormInput, LessonStatus } from "../types";

const initialFormState: LessonFormInput = {
  title: "",
  status: "draft",
  videoUrl: "",
};

type LessonFormProps = {
  lesson?: Lesson | null;
  isSubmitting: boolean;
  onCancel?: () => void;
  onSubmit: (input: LessonFormInput) => Promise<void>;
};

function validateLessonForm(input: LessonFormInput) {
  if (input.title.trim().length < 3) {
    return "O titulo precisa ter pelo menos 3 caracteres.";
  }

  const videoUrl = input.videoUrl.trim();

  if (videoUrl.length > 0) {
    try {
      new URL(videoUrl);
    } catch {
      return "Informe uma URL de video valida.";
    }
  }

  return null;
}

function toFormState(lesson?: Lesson | null): LessonFormInput {
  if (!lesson) {
    return initialFormState;
  }

  return {
    title: lesson.title,
    status: lesson.status,
    videoUrl: lesson.videoUrl ?? "",
  };
}

export function LessonForm({
  lesson,
  isSubmitting,
  onCancel,
  onSubmit,
}: LessonFormProps) {
  const [form, setForm] = useState<LessonFormInput>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(lesson);

  useEffect(() => {
    setForm(toFormState(lesson));
    setError(null);
  }, [lesson]);

  function updateField(field: keyof LessonFormInput, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateLessonForm(form);

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
          : "Nao foi possivel salvar a aula.",
      );
    }
  }

  return (
    <section
      className={`course-form-panel${isEditing ? " is-editing" : ""}`}
      aria-labelledby="lesson-form-title"
    >
      <div className="course-form-heading">
        <p className="eyebrow">{isEditing ? "Editar aula" : "Nova aula"}</p>
        <h2 id="lesson-form-title">
          {isEditing ? "Salvar alteracoes" : "Criar aula"}
        </h2>
        {isEditing ? (
          <p className="editing-note">
            Voce esta editando {lesson?.title}. Salve ou cancele para voltar a
            criacao.
          </p>
        ) : null}
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Titulo
          <input
            name="title"
            onChange={(event) => updateField("title", event.target.value)}
            type="text"
            value={form.title}
          />
        </label>

        <label>
          Status
          <select
            name="status"
            onChange={(event) =>
              updateField("status", event.target.value as LessonStatus)
            }
            value={form.status}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </label>

        <label>
          URL do video
          <input
            name="videoUrl"
            onChange={(event) => updateField("videoUrl", event.target.value)}
            placeholder="https://..."
            type="text"
            value={form.videoUrl}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          <button disabled={isSubmitting} type="submit">
            {isSubmitting
              ? isEditing
                ? "Salvando..."
                : "Criando..."
              : isEditing
                ? "Salvar alteracoes"
                : "Criar aula"}
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
