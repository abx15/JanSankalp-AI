import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { SignJWT } from "jose"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
                    const res = await fetch(`${NEST_API_INTERNAL_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    });

                    if (!res.ok) {
                        const err = await res.json();
                        // Handle pending email verification error separately
                        if (res.status === 401 && err.message === "Email verification pending") {
                            throw new Error(`EMAIL_NOT_VERIFIED:${credentials.email}`);
                        }
                        return null;
                    }

                    const result = await res.json();
                    if (result.success && result.user) {
                        return {
                            id: result.user.id,
                            name: result.user.name,
                            email: result.user.email,
                            role: result.user.role,
                            points: result.user.points,
                            stateId: result.user.stateId,
                            districtId: result.user.districtId,
                            cityId: result.user.cityId,
                            wardId: result.user.wardId,
                            accessToken: result.accessToken
                        };
                    }
                    return null;
                } catch (error: any) {
                    console.error("Auth authorize error:", error);
                    // Re-throw email verification errors so NextAuth redirect maps it
                    if (error.message?.startsWith("EMAIL_NOT_VERIFIED:")) {
                        throw error;
                    }
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, account, profile, trigger, session }) {
            let baseToken = token;
            if (authConfig.callbacks?.jwt) {
                // @ts-ignore
                baseToken = await authConfig.callbacks.jwt({ token, user, account, profile, trigger, session });
            }

            // On first login, assign accessToken from returned user object
            if (user && (user as any).accessToken) {
                baseToken.accessToken = (user as any).accessToken;
            }

            // Fallback: Generate token if missing (e.g. older sessions)
            if (baseToken.id && !baseToken.accessToken) {
                const secretString = process.env.AUTH_SECRET || "I/9TpoQCI36gforZOYZ2MsOS7MjqWMdPwTBJW1WWQpg=";
                const secret = new TextEncoder().encode(secretString);
                baseToken.accessToken = await new SignJWT({ sub: baseToken.id as string })
                    .setProtectedHeader({ alg: "HS256" })
                    .setExpirationTime("24h")
                    .sign(secret);
            }

            // Refresh role from NestJS DB if missing or needs update
            if (baseToken.id && !baseToken.role) {
                try {
                    const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
                    const res = await fetch(`${NEST_API_INTERNAL_URL}/auth/session`, {
                        headers: {
                            'Authorization': `Bearer ${baseToken.accessToken}`
                        }
                    });
                    if (res.ok) {
                        const result = await res.json();
                        if (result.success && result.user) {
                            baseToken.role = result.user.role;
                            baseToken.points = result.user.points;
                            baseToken.stateId = result.user.stateId;
                            baseToken.districtId = result.user.districtId;
                            baseToken.cityId = result.user.cityId;
                            baseToken.wardId = result.user.wardId;
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch session from NestJS in jwt callback:", error);
                }
            }

            return baseToken;
        },
    },
});
