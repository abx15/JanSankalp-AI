/**
 * DATA LAYER — Prisma singleton
 *
 * This is the single source of truth for the Prisma client.
 * All repository files import from here. Only this file
 * may instantiate PrismaClient.
 *
 * MVDC: D = Data Layer
 */
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    // eslint-disable-next-line no-var
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
