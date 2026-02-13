import NextAuth, { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface User {
        id: string
        role: Role
        points: number
    }

    interface Session {
        user: {
            id: string
            role: Role
            points: number
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: Role
        points: number
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        role: Role
        points: number
    }
}
