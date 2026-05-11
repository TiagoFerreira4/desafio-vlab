import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuestInstructorCard } from "../../src/features/guest-instructor/components/guest-instructor-card";
import type { GuestInstructor } from "../../src/features/guest-instructor/types";

const instructor: GuestInstructor = {
  name: "Helena Martins",
  email: "helena.martins@example.com",
  avatarUrl: "https://example.com/helena.png",
  nationality: "BR",
};

describe("GuestInstructorCard", () => {
  it("renders loading state", () => {
    render(
      <GuestInstructorCard error={null} instructor={null} isLoading={true} />,
    );

    expect(screen.getByText("Buscando instrutor...")).toBeVisible();
  });

  it("renders error state", () => {
    render(
      <GuestInstructorCard
        error="Nao foi possivel carregar o instrutor."
        instructor={null}
        isLoading={false}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Nao foi possivel carregar o instrutor.",
    );
  });

  it("renders instructor profile", () => {
    render(
      <GuestInstructorCard
        error={null}
        instructor={instructor}
        isLoading={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Instrutor convidado" }),
    ).toBeVisible();
    expect(screen.getByText(instructor.name)).toBeVisible();
    expect(screen.getByText(instructor.email)).toBeVisible();
    expect(screen.getByText(instructor.nationality)).toBeVisible();
    expect(screen.getByRole("img", { name: `Foto de ${instructor.name}` }))
      .toHaveAttribute("src", instructor.avatarUrl);
  });

  it("does not render a profile when no instructor is available", () => {
    render(
      <GuestInstructorCard error={null} instructor={null} isLoading={false} />,
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByText(instructor.name)).not.toBeInTheDocument();
  });
});
