/**
 * Notification Module — Zod Validation Schemas
 *
 * MVDC: Schema/validation layer for the Notification module.
 */
import { z } from "zod";

export const createNotificationSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR", "COMPLAINT_UPDATE"]).default("INFO"),
    link: z.string().optional(),
});

export const markReadSchema = z.object({
    notificationId: z.string().min(1, "Notification ID is required"),
});

export const markAllReadSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
});

// Inferred types
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type MarkReadInput = z.infer<typeof markReadSchema>;
export type MarkAllReadInput = z.infer<typeof markAllReadSchema>;
