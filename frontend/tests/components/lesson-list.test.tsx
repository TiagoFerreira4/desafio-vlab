import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LessonList } from "../../src/features/lessons/components/lesson-list";
import type { Lesson } from "../../src/features/lessons/types";

const lessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "Aula publicada com video",
    status: "published",
    videoUrl: "https://videos.example.com/aula-1",
    courseId: "course-1",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "lesson-2",
    title: "Rascunho sem video",
    status: "draft",
    videoUrl: null,
    courseId: "course-1",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  },
];

describe("LessonList", () => {
  it("renders lessons with translated status and video state", () => {
    render(<LessonList canManage={false} lessons={lessons} />);

    expect(screen.getByRole("heading", { name: lessons[0].title })).toBeVisible();
    expect(screen.getByRole("heading", { name: lessons[1].title })).toBeVisible();
    expect(screen.getByText("Publicado")).toBeVisible();
    expect(screen.getByText("Rascunho")).toBeVisible();
    expect(screen.getByRole("link", { name: /abrir video/i })).toHaveAttribute(
      "href",
      lessons[0].videoUrl,
    );
    expect(screen.getByText("Sem video.")).toBeVisible();
  });

  it("shows management actions only when allowed", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <LessonList
        canManage
        lessons={[lessons[0]]}
        onDelete={onDelete}
        onEdit={onEdit}
      />,
    );

    await user.click(screen.getByRole("button", { name: /editar/i }));
    await user.click(screen.getByRole("button", { name: /excluir/i }));

    expect(onEdit).toHaveBeenCalledWith(lessons[0]);
    expect(onDelete).toHaveBeenCalledWith(lessons[0]);
  });

  it("hides management actions in read-only mode", () => {
    render(<LessonList canManage={false} lessons={lessons} />);

    expect(screen.queryByRole("button", { name: /editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /excluir/i })).not.toBeInTheDocument();
  });

  it("marks the lesson being edited and disables its actions", () => {
    render(
      <LessonList
        canManage
        deletingLessonId="lesson-1"
        editingLessonId="lesson-1"
        lessons={[lessons[0]]}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("Em edicao")).toBeVisible();
    expect(screen.getByRole("button", { name: /editando/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /excluindo/i })).toBeDisabled();
  });
});
