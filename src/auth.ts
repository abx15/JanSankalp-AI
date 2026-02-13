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

            // @ts-ignore
            const existingUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            // Prevent login if email is not verified
            if (!existingUser?.emailVerified) return false;

            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.role = token.role
                // @ts-ignore
                session.user.id = token.id
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role
                token.id = user.id
            } else if (token.id) {
                // Refresh role from DB if needed
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { role: true }
                });
                if (dbUser) {
                    token.role = dbUser.role;
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
