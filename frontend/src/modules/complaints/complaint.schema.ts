import { z } from "zod";

export const createComplaintSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    imageUrl: z.string().url().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    authorId: z.string().min(1, "Author ID is required"),
});

export const updateComplaintSchema = z.object({
    status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]).optional(),
    category: z.string().optional(),
    departmentId: z.string().optional(),
});

export type CreateComplaintRequest = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintRequest = z.infer<typeof updateComplaintSchema>;
