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
    creatorId: user.id,
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

async function mockApi(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("coursesphere.token", "visual-test-token");
  });

  await page.route("http://localhost:3333/**", async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === "/auth/me") {
      await route.fulfill({ json: { user } });
      return;
    }

    if (url.pathname === "/courses") {
      await route.fulfill({ json: { courses } });
      return;
    }

    if (url.pathname === "/courses/course-1") {
      await route.fulfill({ json: { course: courses[0] } });
      return;
    }

    if (url.pathname === "/courses/course-1/lessons/") {
      await route.fulfill({ json: { lessons } });
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

test("course details handle lesson controls", async ({ page }, testInfo) => {
  await mockApi(page);
  await page.goto("/courses/course-1");
  await expect(
    page.getByRole("heading", { name: courses[0].name }).first(),
  ).toBeVisible();
  await expect(page.getByText(lessons[0].title)).toBeVisible();
  await capture(page, testInfo, "course-details");
});
