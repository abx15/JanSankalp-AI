import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url().optional(),

    // AI Service
    AI_SERVICE_URL: z.string().url().default("http://localhost:8000"),
    GROK_API_KEY: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    ASSEMBLY_AI_API_KEY: z.string().min(1).optional(),
    COHERE_API_KEY: z.string().min(1).optional(),
    HUGGINGFACE_API_KEY: z.string().min(1).optional(),

    // Third Party
    RESEND_API_KEY: z.string().min(1).optional(),
    IMAGEKIT_PUBLIC_KEY: z.string().optional(),
    IMAGEKIT_PRIVATE_KEY: z.string().optional(),
    IMAGEKIT_URL_ENDPOINT: z.string().optional(),

    // App Env
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
