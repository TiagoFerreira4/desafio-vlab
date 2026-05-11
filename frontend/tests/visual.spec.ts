import { expect, test, type Page, type TestInfo } from "@playwright/test";

const user = {
  id: "user-1",
  name: "Maria Eduarda Albuquerque de Souza - Coordenadora Academica",
  email: "maria@example.com",
};

const courses = [
  {
    id: "course-1",
    name: "Arquitetura de Software para Plataformas Educacionais Complexas",
    description:
      "Curso com uma descricao longa para validar quebra de linha, espacamento entre cards e comportamento responsivo sem sobrepor textos.",
    startDate: "2026-05-01T00:00:00.000Z",
    endDate: "2026-08-30T00:00:00.000Z",
    creatorId: user.id,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "course-2",
    name: "UX Research e Produto",
    description: null,
    startDate: "2026-06-10T00:00:00.000Z",
    endDate: "2026-07-22T00:00:00.000Z",
    creatorId: "user-2",
    createdAt: "2026-04-15T00:00:00.000Z",
    updatedAt: "2026-05-03T00:00:00.000Z",
  },
];

const lessons = [
  {
    id: "lesson-1",
    title: "Introducao ao desenho de sistemas com titulo propositalmente longo",
    status: "draft",
    videoUrl:
      "https://videos.example.com/cursos/arquitetura/modulo-01/aula-com-url-bem-longa-para-validar-layout",
    courseId: "course-1",
    createdAt: "2026-05-02T00:00:00.000Z",
    updatedAt: "2026-05-03T00:00:00.000Z",
  },
  {
    id: "lesson-2",
    title: "Publicacao e acompanhamento",
    status: "published",
    videoUrl: null,
    courseId: "course-1",
    createdAt: "2026-05-04T00:00:00.000Z",
    updatedAt: "2026-05-05T00:00:00.000Z",
  },
];

const externalLessons = [
  {
    id: "lesson-3",
    title: "Pesquisa exploratoria e entrevistas",
    status: "published",
    videoUrl: "https://videos.example.com/cursos/ux-research/aula-01",
    courseId: "course-2",
    createdAt: "2026-05-06T00:00:00.000Z",
    updatedAt: "2026-05-07T00:00:00.000Z",
  },
  {
    id: "lesson-4",
    title: "Rascunho privado do criador",
    status: "draft",
    videoUrl: null,
    courseId: "course-2",
    createdAt: "2026-05-08T00:00:00.000Z",
    updatedAt: "2026-05-09T00:00:00.000Z",
  },
];

const guestInstructor = {
  results: [
    {
      name: {
        first: "Helena",
        last: "Martins",
      },
      email: "helena.martins@example.com",
      picture: {
        large:
          "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2072'%3E%3Crect%20width='72'%20height='72'%20fill='%23e8f4f7'/%3E%3Ccircle%20cx='36'%20cy='28'%20r='14'%20fill='%23166783'/%3E%3Cpath%20d='M14%2066c4-16%2018-24%2022-24s18%208%2022%2024'%20fill='%23166783'/%3E%3C/svg%3E",
      },
      nat: "BR",
    },
  ],
};

async function mockApi(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("coursesphere.token", "visual-test-token");
  });

  await page.route("https://randomuser.me/api/**", async (route) => {
    await route.fulfill({ json: guestInstructor });
  });

  await page.route("http://localhost:3333/**", async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === "/auth/me") {
      await route.fulfill({ json: { user } });
      return;
    }

    if (url.pathname === "/courses") {
      const scope = url.searchParams.get("scope") ?? "mine";
      await route.fulfill({
        json: {
          courses:
            scope === "all"
              ? courses
              : courses.filter((course) => course.creatorId === user.id),
        },
      });
      return;
    }

    if (url.pathname === "/courses/course-1") {
      await route.fulfill({ json: { course: courses[0] } });
      return;
    }

    if (url.pathname === "/courses/course-2") {
      await route.fulfill({ json: { course: courses[1] } });
      return;
    }

    if (url.pathname === "/courses/course-1/lessons/") {
      await route.fulfill({ json: { lessons } });
      return;
    }

    if (url.pathname === "/courses/course-2/lessons/") {
      await route.fulfill({
        json: {
          lessons: externalLessons.filter(
            (lesson) => lesson.status === "published",
          ),
        },
      });
      return;
    }

    await route.fulfill({
      status: 404,
      json: { message: `Unhandled mock route: ${url.pathname}` },
    });
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    const documentWidth = document.documentElement.scrollWidth;
    const viewportWidth = document.documentElement.clientWidth;
    return documentWidth > viewportWidth + 1;
  });

  expect(hasOverflow).toBe(false);
}

async function capture(page: Page, testInfo: TestInfo, name: string) {
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    fullPage: true,
    path: testInfo.outputPath(`${name}.png`),
  });
}

test("login page remains readable", async ({ page }, testInfo) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  await capture(page, testInfo, "login");
});

test("register page remains readable", async ({ page }, testInfo) => {
  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
  await capture(page, testInfo, "register");
});

test("dashboard handles dense course content", async ({ page }, testInfo) => {
  await mockApi(page);
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { exact: true, name: "Cursos" }),
  ).toBeVisible();
  await expect(page.getByText(courses[0].name)).toBeVisible();
  await capture(page, testInfo, "dashboard");
});

test("dashboard shows all courses in read-only catalog", async ({ page }, testInfo) => {
  await mockApi(page);
  await page.goto("/dashboard?tab=all");
  await expect(
    page.getByRole("tab", { name: "Todos os cursos", selected: true }),
  ).toBeVisible();
  await expect(page.getByText(courses[1].name)).toBeVisible();
  await expect(
    page.getByText("Cursos da plataforma em modo leitura."),
  ).toBeVisible();
  await capture(page, testInfo, "dashboard-all-courses");
});

test("course details handle lesson controls", async ({ page }, testInfo) => {
  await mockApi(page);
  await page.goto("/courses/course-1");
  await expect(
    page.getByRole("heading", { name: courses[0].name }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Instrutor convidado" }),
  ).toBeVisible();
  await expect(page.getByText("Helena Martins")).toBeVisible();
  await expect(page.getByText(lessons[0].title)).toBeVisible();
  await capture(page, testInfo, "course-details");
});

test("course details hide management controls in catalog mode", async ({
  page,
}, testInfo) => {
  await mockApi(page);
  await page.goto("/courses/course-2?scope=all");
  await expect(
    page.getByRole("heading", { name: courses[1].name }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Apenas aulas publicadas estao disponiveis."),
  ).toBeVisible();
  await expect(page.getByText(externalLessons[0].title)).toBeVisible();
  const videoLink = page.getByRole("link", { name: "Abrir video" });
  await expect(videoLink).toBeVisible();
  await expect(videoLink).toHaveAttribute(
    "href",
    "https://videos.example.com/cursos/ux-research/aula-01",
  );
  await expect(page.getByText("Rascunho privado do criador")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Rascunho" })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Criar aula" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Editar" })).toHaveCount(0);
  await capture(page, testInfo, "course-details-read-only");
});
