FROM node:24-alpine

RUN apk add --no-cache openssl

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json

RUN pnpm install --filter backend... --frozen-lockfile

COPY backend ./backend

WORKDIR /app/backend

RUN pnpm prisma generate && pnpm build

EXPOSE 3333

CMD ["sh", "-c", "pnpm prisma:deploy && pnpm start"]
