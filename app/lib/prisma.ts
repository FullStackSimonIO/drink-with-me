// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // im Dev-Modus verhindere mehrfaches Instanziieren
  // @ts-ignore
  var __prisma: PrismaClient | undefined;
}

// **Keine** Optionen hier übergeben!
export const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  global.__prisma = prisma;
}
