import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import prisma from "@/lib/prisma"
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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) return null;

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) return null;

                // Block login for unverified non-admin users
                if (user.role !== "ADMIN" && !user.emailVerified) {
                    throw new Error(`EMAIL_NOT_VERIFIED:${user.email}`);
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    points: user.points,
                    stateId: user.stateId,
                    districtId: user.districtId,
                    cityId: user.cityId,
                    wardId: user.wardId,
                };
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

            // Refresh role from DB if missing
            if (baseToken.id && !baseToken.role) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: baseToken.id as string },
                    select: { role: true, points: true, stateId: true, districtId: true, cityId: true, wardId: true },
                });
                if (dbUser) {
                    baseToken.role = dbUser.role as Role;
                    baseToken.points = dbUser.points as number;
                    baseToken.stateId = dbUser.stateId;
                    baseToken.districtId = dbUser.districtId;
                    baseToken.cityId = dbUser.cityId;
                    baseToken.wardId = dbUser.wardId;
                }
            }

            return baseToken;
        },
    },
});
