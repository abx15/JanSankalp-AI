/**
 * BACKWARD COMPATIBILITY SHIM
 *
 * The canonical Prisma singleton now lives in `@/data/prisma`.
 * This file re-exports it so that any existing code that still
 * imports from `@/lib/prisma` continues to work without changes.
 *
 * DO NOT add new imports from this path — use `@/data/prisma` instead.
 */
export { default } from "@/data/prisma";

