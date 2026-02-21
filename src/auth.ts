import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                // @ts-ignore
                if (!user || !user.password) return null

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    // @ts-ignore
                    user.password
                )

                if (!isPasswordValid) return null

                return user
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") return true;

            const existingUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!existingUser) return false;

            // Skip email verification check for admin users
            if (existingUser.role === "ADMIN") return true;

            if (!existingUser.emailVerified) {
                return `/verify?email=${encodeURIComponent(existingUser.email)}`;
            }

            return true;
        },
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
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.points = user.points;
                token.stateId = (user as any).stateId;
                token.districtId = (user as any).districtId;
                token.cityId = (user as any).cityId;
                token.wardId = (user as any).wardId;
            }

            // Refresh data from DB occasionally or if token.id exists but role is missing
            if (token.id && (!token.role || !token.stateId)) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: {
                        role: true,
                        points: true,
                        stateId: true,
                        districtId: true,
                        cityId: true,
                        wardId: true
                    }
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
            return token
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
})
