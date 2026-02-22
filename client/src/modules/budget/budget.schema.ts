/**
 * Budget Module — Zod Validation Schemas
 *
 * MVDC: Schema/validation layer for the Budget module.
 * All request bodies for budget API endpoints are validated here.
 */
import { z } from "zod";

export const forecastParamsSchema = z.object({
    periodType: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]).default("MONTHLY"),
    periods: z.coerce.number().int().min(1).max(60).default(12),
    departmentId: z.string().optional(),
    stateId: z.string().optional(),
    districtId: z.string().optional(),
});

export const customForecastSchema = z.object({
    periodType: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]).default("MONTHLY"),
    periods: z.coerce.number().int().min(1).max(60).default(12),
    departmentId: z.string().optional(),
    stateId: z.string().optional(),
    districtId: z.string().optional(),
    description: z.string().optional(),
});

export const optimizationParamsSchema = z.object({
    departmentId: z.string().optional(),
    stateId: z.string().optional(),
    districtId: z.string().optional(),
});

export const optimizationActionSchema = z.object({
    suggestionId: z.string().optional(),
    action: z.enum(["APPROVE", "REJECT", "DEFER"]),
    notes: z.string().optional(),
    departmentId: z.string().optional(),
    category: z.string().optional(),
    potentialSavings: z.number().optional(),
});

export const scenarioSchema = z.object({
    scenarioType: z.string().min(1, "Scenario type is required"),
    parameters: z.record(z.unknown()).optional(),
    departmentId: z.string().optional(),
});

export const demandSurgeParamsSchema = z.object({
    periodType: z.enum(["MONTHLY", "QUARTERLY"]).default("MONTHLY"),
    periods: z.coerce.number().int().min(1).max(24).default(6),
    departmentId: z.string().optional(),
    stateId: z.string().optional(),
    districtId: z.string().optional(),
});

export const customDemandSurgeSchema = z.object({
    category: z.string().min(1),
    expectedSurge: z.number().optional(),
    departmentId: z.string().optional(),
    period: z.string().optional(),
});

// Inferred types
export type ForecastParams = z.infer<typeof forecastParamsSchema>;
export type CustomForecastInput = z.infer<typeof customForecastSchema>;
export type OptimizationParams = z.infer<typeof optimizationParamsSchema>;
export type OptimizationAction = z.infer<typeof optimizationActionSchema>;
export type ScenarioInput = z.infer<typeof scenarioSchema>;
export type DemandSurgeParams = z.infer<typeof demandSurgeParamsSchema>;
export type CustomDemandSurgeInput = z.infer<typeof customDemandSurgeSchema>;
