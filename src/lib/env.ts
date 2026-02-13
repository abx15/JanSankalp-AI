import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url().optional(),
    OPENAI_API_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    NEXT_PUBLIC_PUSHER_KEY: z.string().min(1),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1),
    NEXT_PUBLIC_PUSHER_APP_ID: z.string().min(1).optional(), // pusher appId is server side usually
    PUSHER_SECRET: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error("❌ Invalid environment variables:", env.error.format());
    // We don't throw error here to allow build process to finish if some keys are omitted during ci
    // but we warn heavily.
}

export const ENV = env.success ? env.data : process.env as any;
