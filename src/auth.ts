import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

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
            // Allow OAuth without verification for now (if added later)
            if (account?.provider !== "credentials") return true;

            const existingUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!existingUser?.emailVerified) return false;

            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).points = token.points;
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
                token.id = user.id
                token.points = (user as any).points
            } else if (token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { role: true, points: true }
                });
                if (dbUser) {
                    token.role = dbUser.role;
                    token.points = (dbUser as any).points;
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
})
