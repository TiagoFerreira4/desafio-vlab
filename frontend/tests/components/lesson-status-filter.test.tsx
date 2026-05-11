import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LessonStatusFilter } from "../../src/features/lessons/components/lesson-status-filter";

describe("LessonStatusFilter", () => {
  it("renders all status filters and marks the active one", () => {
    render(<LessonStatusFilter value="draft" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: /todos/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /rascunhos/i })).toHaveClass(
      "is-active",
    );
    expect(screen.getByRole("button", { name: /publicados/i })).toBeVisible();
  });

  it("calls onChange with the selected status", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<LessonStatusFilter value="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /rascunhos/i }));
    await user.click(screen.getByRole("button", { name: /publicados/i }));

    expect(onChange).toHaveBeenNthCalledWith(1, "draft");
    expect(onChange).toHaveBeenNthCalledWith(2, "published");
  });
});
