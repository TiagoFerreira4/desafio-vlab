# CourseSphere

## Backend

### Pré-requisitos

- Node.js 24 ou compatível com o projeto.
- pnpm 10.
- Docker e Docker Compose.

### Setup Local

Instale as dependências:

```bash
pnpm install
```

Crie o arquivo de ambiente do backend:

```bash
cp backend/.env.example backend/.env
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

Com o backend rodando, acesse a documentação interativa em:

```text
http://localhost:3333/docs
```

A especificação OpenAPI em JSON fica em:

```text
http://localhost:3333/docs/json
```

### Setup Com Docker Compose

Para subir banco e backend juntos:

```bash
docker compose up --build
```

O container do backend executa as migrations automaticamente antes de iniciar a API.

## Testando Rotas Protegidas No Swagger

1. Execute `POST /auth/register` ou `POST /auth/login`.
2. Copie o `token` retornado.
3. Clique em `Authorize`.
4. Informe o token no formato:

```text
Bearer <token>
```

Depois disso, as rotas protegidas, como `/auth/me` e `/courses`, podem ser executadas pela própria UI do Swagger.

## Autenticação

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

Como a autenticação é stateless, logout no frontend significa remover o token salvo localmente.

## Rotas De Courses

Todas as rotas de cursos exigem autenticação via Bearer Token:

```text
Authorization: Bearer <token>
```

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/courses` | Lista os cursos criados pelo usuário autenticado. |
| `GET` | `/courses?search=react` | Lista os cursos do usuário filtrando pelo nome. A busca é parcial e não diferencia maiúsculas/minúsculas. |
| `GET` | `/courses/:id` | Busca um curso específico, desde que pertença ao usuário autenticado. |
| `POST` | `/courses` | Cria um novo curso para o usuário autenticado. |
| `PUT` | `/courses/:id` | Atualiza um curso do usuário autenticado. Deve enviar o corpo completo do curso. |
| `DELETE` | `/courses/:id` | Remove um curso do usuário autenticado. |

Payload para criação e atualização:

```json
{
  "name": "React Basics",
  "description": "Curso introdutório de React",
  "startDate": "2026-05-10",
  "endDate": "2026-06-10"
}
```

Regras principais:

- `name` é obrigatório e precisa ter pelo menos 3 caracteres.
- `description` é opcional.
- `startDate` e `endDate` são obrigatórios.
- `endDate` deve ser igual ou posterior a `startDate`.
- Apenas o criador do curso pode consultar, atualizar ou remover esse curso.

## Rotas De Lessons

Todas as rotas de aulas exigem autenticação via Bearer Token e são aninhadas em um curso:

```text
Authorization: Bearer <token>
```

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/courses/:courseId/lessons` | Lista as aulas de um curso do usuário autenticado. |
| `GET` | `/courses/:courseId/lessons/:lessonId` | Busca uma aula específica do curso. |
| `POST` | `/courses/:courseId/lessons` | Cria uma nova aula no curso. |
| `PUT` | `/courses/:courseId/lessons/:lessonId` | Atualiza uma aula do curso. Deve enviar o corpo completo da aula. |
| `DELETE` | `/courses/:courseId/lessons/:lessonId` | Remove uma aula do curso. |

Payload para criação e atualização:

```json
{
  "title": "Introdução ao React",
  "status": "draft",
  "videoUrl": "https://example.com/video"
}
```

Regras principais:

- `title` é obrigatório e precisa ter pelo menos 3 caracteres.
- `status` é obrigatório e aceita apenas `draft` ou `published`.
- `videoUrl` é opcional, mas quando informado precisa ser uma URL válida.
- Toda aula pertence a um curso.
- Apenas o criador do curso pode consultar, criar, atualizar ou remover aulas desse curso.

## Testes

```bash
pnpm test
```

Também é possível rodar os comandos diretamente no pacote do backend:

```bash
pnpm --filter backend test
pnpm --filter backend build
```
