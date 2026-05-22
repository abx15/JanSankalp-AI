/**
 * User Module — Zod Validation Schemas
 *
 * MVDC: Schema/validation layer for the User module.
 */
import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    stateId: z.string().optional(),
    districtId: z.string().optional(),
    cityId: z.string().optional(),
    wardId: z.string().optional(),
});

export const adminActionSchema = z.object({
    action: z.enum(["delete", "updateRole", "suspend", "activate"]),
    role: z.string().optional(),
    reason: z.string().optional(),
});

export const adminUserActionWithIdSchema = adminActionSchema.extend({
    userId: z.string().min(1, "User ID is required"),
});

// Inferred types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AdminAction = z.infer<typeof adminActionSchema>;
export type AdminUserActionWithId = z.infer<typeof adminUserActionWithIdSchema>;
