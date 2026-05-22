/**
 * Sovereign Module — Zod Validation Schemas
 *
 * MVDC: Schema/validation layer for the Sovereign AI module.
 */
import { z } from "zod";

export const sovereignAnalysisSchema = z.object({
    stateId: z.string().optional(),
    districtId: z.string().optional(),
    category: z.string().optional(),
    timeframe: z.enum(["WEEK", "MONTH", "QUARTER", "YEAR"]).default("MONTH"),
    includeForecasting: z.boolean().default(false),
});

export const policySimulationSchema = z.object({
    policyType: z.string().min(1, "Policy type is required"),
    parameters: z.record(z.unknown()).default({}),
    targetRegion: z.string().optional(),
});

// Inferred types
export type SovereignAnalysisInput = z.infer<typeof sovereignAnalysisSchema>;
export type PolicySimulationInput = z.infer<typeof policySimulationSchema>;
