import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

// WebSocket setup for local development
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as {
  prismaNew: PrismaClient | undefined;
  neonPool:  Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Singleton pool — prevents opening a new TCP connection on every invocation
  if (!globalForPrisma.neonPool) {
    globalForPrisma.neonPool = new Pool({ connectionString, max: 5 });
  }

  const adapter = new PrismaNeon(globalForPrisma.neonPool);
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prismaNew ??
  (globalForPrisma.prismaNew = createPrismaClient());

