import { buildApp } from "./app.js";
import { env } from "../shared/infra/env/env.js";
import { prisma } from "../shared/infra/prisma/prisma.service.js";

const app = await buildApp();

async function shutdown(signal: string) {
  app.log.info({ signal }, "shutting down");

  await app.close();
  await prisma.$disconnect();

  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

try {
  await app.listen({
    host: env.HOST,
    port: env.PORT,
  });
} catch (error) {
  app.log.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
