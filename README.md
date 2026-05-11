# CourseSphere

Aplicacao full stack para gestao de cursos online e aulas. O projeto tem API REST em Node.js/Fastify com Prisma/PostgreSQL e frontend em React/Vite.

## Funcionalidades

- Registro, login e logout com JWT.
- Rotas protegidas no frontend e no backend.
- CRUD de cursos do usuario autenticado.
- CRUD de aulas por curso.
- Permissoes por criador: todos os usuarios autenticados consultam cursos, mas apenas o criador cria, edita e remove seus cursos e aulas.
- Catalogo com todos os cursos da plataforma em modo leitura.
- Aulas em rascunho visiveis apenas para o criador do curso; demais usuarios veem somente aulas publicadas.
- Busca de cursos por nome.
- Filtro de aulas por status `draft` ou `published`.
- Consumo da Random User API no frontend para sugerir um instrutor convidado na tela de detalhes do curso.
- Swagger/OpenAPI para explorar a API.

## Pre-requisitos

- Node.js 24 ou compativel com o projeto.
- pnpm 10.
- Docker e Docker Compose.

## Setup Local

Instale as dependencias na raiz do projeto:

```bash
pnpm install
```

Crie os arquivos de ambiente:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Suba o banco de dados:

```bash
docker compose up -d db
```

Execute as migrations:

```bash
pnpm --filter backend prisma:deploy
```

Inicie o backend:

```bash
pnpm dev:backend
```

Em outro terminal, inicie o frontend:

```bash
pnpm dev:frontend
```

URLs locais:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3333
Swagger:  http://localhost:3333/docs
OpenAPI:  http://localhost:3333/docs/json
Health:   http://localhost:3333/health
```

## Usuarios De Teste

Nao ha usuario seedado. Crie uma conta pela tela de registro em:

```text
http://localhost:5173/register
```

Tambem e possivel criar usuario diretamente pela API usando `POST /auth/register`.

## Setup Com Docker Compose

Para subir banco e backend juntos:

```bash
docker compose up --build
```

O container do backend executa as migrations automaticamente antes de iniciar a API.

O frontend roda fora do Docker:

```bash
pnpm dev:frontend
```

Para encerrar os servicos:

```bash
docker compose down
```

## Autenticacao

O backend usa JWT stateless. As rotas `POST /auth/register` e `POST /auth/login` retornam:

```json
{
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "token": "jwt-token"
}
```

Rotas protegidas devem receber o header:

```text
Authorization: Bearer <token>
```

Como a autenticacao e stateless, logout no frontend significa remover o token salvo localmente.

## Testando Rotas Protegidas No Swagger

1. Execute `POST /auth/register` ou `POST /auth/login`.
2. Copie o `token` retornado.
3. Clique em `Authorize`.
4. Informe o token no formato:

```text
Bearer <token>
```

Depois disso, rotas protegidas como `/auth/me`, `/courses` e `/courses/:courseId/lessons` podem ser executadas pela UI do Swagger.

## Rotas De Courses

Todas as rotas de cursos exigem autenticacao via Bearer Token.

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/courses` | Lista os cursos criados pelo usuario autenticado. Equivale a `scope=mine`. |
| `GET` | `/courses?scope=mine&search=react` | Lista os cursos do usuario filtrando pelo nome. A busca e parcial e case-insensitive. |
| `GET` | `/courses?scope=all&search=react` | Lista todos os cursos da plataforma para usuarios autenticados, em modo leitura no frontend. |
| `GET` | `/courses/:id` | Busca um curso especifico. Qualquer usuario autenticado pode visualizar. |
| `POST` | `/courses` | Cria um novo curso para o usuario autenticado. |
| `PUT` | `/courses/:id` | Atualiza um curso do usuario autenticado. Deve enviar o corpo completo do curso. |
| `DELETE` | `/courses/:id` | Remove um curso do usuario autenticado. |

Payload para criacao e atualizacao:

```json
{
  "name": "React Basics",
  "description": "Curso introdutorio de React",
  "startDate": "2026-05-10",
  "endDate": "2026-06-10"
}
```

Regras principais:

- `name` e obrigatorio e precisa ter pelo menos 3 caracteres.
- `description` e opcional.
- `startDate` e `endDate` sao obrigatorios.
- `endDate` deve ser igual ou posterior a `startDate`.
- Qualquer usuario autenticado pode consultar cursos.
- Apenas o criador do curso pode criar, atualizar ou remover esse curso.
- No frontend, a aba `Todos os cursos` exibe cursos em modo leitura, inclusive quando o curso pertence ao usuario autenticado.

## Rotas De Lessons

Todas as rotas de aulas exigem autenticacao via Bearer Token e sao aninhadas em um curso.

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/courses/:courseId/lessons` | Lista as aulas de um curso. Qualquer usuario autenticado pode visualizar. |
| `GET` | `/courses/:courseId/lessons/:lessonId` | Busca uma aula especifica do curso. Qualquer usuario autenticado pode visualizar. |
| `POST` | `/courses/:courseId/lessons` | Cria uma nova aula no curso. |
| `PUT` | `/courses/:courseId/lessons/:lessonId` | Atualiza uma aula do curso. Deve enviar o corpo completo da aula. |
| `DELETE` | `/courses/:courseId/lessons/:lessonId` | Remove uma aula do curso. |

Payload para criacao e atualizacao:

```json
{
  "title": "Introducao ao React",
  "status": "draft",
  "videoUrl": "https://example.com/video"
}
```

Regras principais:

- `title` e obrigatorio e precisa ter pelo menos 3 caracteres.
- `status` e obrigatorio e aceita apenas `draft` ou `published`.
- `videoUrl` e opcional, mas quando informado precisa ser uma URL valida.
- Toda aula pertence a um curso.
- Qualquer usuario autenticado pode consultar aulas publicadas.
- Aulas em `draft` sao visiveis apenas para o criador do curso.
- Apenas o criador do curso pode criar, atualizar ou remover aulas desse curso.

## API Externa

O frontend consome a Random User API para mostrar um instrutor convidado na tela de detalhes do curso.

```text
https://randomuser.me/api/1.4/?seed=<courseId>&inc=name,picture,email,nat&noinfo
```

O `courseId` e usado como `seed`, entao o mesmo curso tende a exibir o mesmo instrutor. A informacao e apenas visual e nao e persistida no banco. Se a API externa falhar, o curso e as aulas continuam funcionando normalmente.

## Testes E Builds

Rodar testes automatizados do backend:

```bash
pnpm test
```

Build do backend:

```bash
pnpm build:backend
```

Build do frontend:

```bash
pnpm build:frontend
```

Testes visuais do frontend:

```bash
pnpm --filter frontend test:visual
```

Comandos equivalentes por pacote:

```bash
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend build
pnpm --filter frontend test:visual
```
