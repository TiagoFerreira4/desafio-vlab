# CourseSphere

## Backend

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

## Testando Rotas Protegidas No Swagger

1. Execute `POST /auth/register` ou `POST /auth/login`.
2. Copie o `token` retornado.
3. Clique em `Authorize`.
4. Informe o token no formato:

```text
Bearer <token>
```

Depois disso, as rotas protegidas, como `/auth/me` e `/courses`, podem ser executadas pela própria UI do Swagger.

## Testes

```bash
pnpm test
```
