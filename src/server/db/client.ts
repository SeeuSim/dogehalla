import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import { env } from "env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  var prismaStore: PrismaSessionStore | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

export const prismaStore = 
  global.prismaStore ||
  new PrismaSessionStore(
    prisma, {
      checkPeriod: 2 * 60 * 1000,  //ms
    }
  );

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.prismaStore = prismaStore;
}



async function connectDB() {
  try {
    await prisma.$connect();
    console.log('? Database connected successfully');
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

export default connectDB;