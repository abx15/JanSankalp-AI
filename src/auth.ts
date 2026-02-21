import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import type { NextAuthConfig } from "next-auth"
import prisma from "@/lib/prisma"

const config: NextAuthConfig = {
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
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as Role;
                session.user.id = token.id as string;
                session.user.points = token.points as number;
                session.user.stateId = token.stateId as string | undefined;
                session.user.districtId = token.districtId as string | undefined;
                session.user.cityId = token.cityId as string | undefined;
                session.user.wardId = token.wardId as string | undefined;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
                token.points = (user as any).points;
                token.stateId = (user as any).stateId;
                token.districtId = (user as any).districtId;
                token.cityId = (user as any).cityId;
                token.wardId = (user as any).wardId;
            }

            // Refresh role from DB if missing
            if (token.id && !token.role) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { role: true, points: true, stateId: true, districtId: true, cityId: true, wardId: true },
                });
                if (dbUser) {
                    token.role = dbUser.role as Role;
                    token.points = dbUser.points as number;
                    token.stateId = dbUser.stateId;
                    token.districtId = dbUser.districtId;
                    token.cityId = dbUser.cityId;
                    token.wardId = dbUser.wardId;
                }
            }

            return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
