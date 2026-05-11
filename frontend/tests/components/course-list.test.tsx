import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { CourseList } from "../../src/features/courses/components/course-list";
import type { Course } from "../../src/features/courses/types";

const course: Course = {
  id: "course-1",
  name: "Arquitetura de Software",
  description: "Curso para validar componentes do catalogo.",
  startDate: "2026-05-01T00:00:00.000Z",
  endDate: "2026-06-01T00:00:00.000Z",
  creatorId: "user-1",
  createdAt: "2026-04-01T00:00:00.000Z",
  updatedAt: "2026-04-02T00:00:00.000Z",
};

function renderCourseList(
  props: Partial<React.ComponentProps<typeof CourseList>> = {},
) {
  return render(
    <MemoryRouter>
      <CourseList
        canManage={false}
        courses={[course]}
        linkScope="mine"
        {...props}
      />
    </MemoryRouter>,
  );
}

describe("CourseList", () => {
  it("renders course information and detail links with the selected scope", () => {
    renderCourseList({ linkScope: "all" });

    expect(screen.getByRole("heading", { name: course.name })).toBeVisible();
    expect(screen.getByText(course.description as string)).toBeVisible();
    expect(screen.getByText("01/05/2026")).toBeVisible();
    expect(screen.getByText("01/06/2026")).toBeVisible();
    expect(screen.getByRole("link", { name: /ver aulas/i })).toHaveAttribute(
      "href",
      "/courses/course-1?scope=all",
    );
  });

  it("shows management actions when the list can be managed", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderCourseList({ canManage: true, onDelete, onEdit });

    await user.click(screen.getByRole("button", { name: /editar/i }));
    await user.click(screen.getByRole("button", { name: /excluir/i }));

    expect(onEdit).toHaveBeenCalledWith(course);
    expect(onDelete).toHaveBeenCalledWith(course);
  });

  it("hides management actions in read-only mode", () => {
    renderCourseList({ canManage: false });

    expect(screen.queryByRole("button", { name: /editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /excluir/i })).not.toBeInTheDocument();
  });

  it("marks the course being edited and disables its actions", () => {
    renderCourseList({
      canManage: true,
      deletingCourseId: "course-1",
      editingCourseId: "course-1",
      onDelete: vi.fn(),
      onEdit: vi.fn(),
    });

    expect(screen.getByText("Em edicao")).toBeVisible();
    expect(screen.getByRole("button", { name: /editando/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /excluindo/i })).toBeDisabled();
  });
});
