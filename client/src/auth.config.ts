import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.role = token.role;
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.points = token.points;
                // @ts-ignore
                session.user.stateId = token.stateId;
                // @ts-ignore
                session.user.districtId = token.districtId;
                // @ts-ignore
                session.user.cityId = token.cityId;
                // @ts-ignore
                session.user.wardId = token.wardId;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                const u = user as any;
                token.role = u.role;
                token.id = u.id;
                token.points = u.points;
                token.stateId = u.stateId;
                token.districtId = u.districtId;
                token.cityId = u.cityId;
                token.wardId = u.wardId;
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
} satisfies NextAuthConfig;
