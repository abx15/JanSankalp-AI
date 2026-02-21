import NextAuth, { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface User {
        id: string
        role: Role
        points: number
        stateId?: string | null
        districtId?: string | null
        cityId?: string | null
        wardId?: string | null
    }

    interface Session {
        user: {
            id: string
            role: Role
            points: number
            stateId?: string | null
            districtId?: string | null
            cityId?: string | null
            wardId?: string | null
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: Role
        points: number
        stateId?: string | null
        districtId?: string | null
        cityId?: string | null
        wardId?: string | null
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        role: Role
        points: number
        stateId?: string | null
        districtId?: string | null
        cityId?: string | null
        wardId?: string | null
    }
}
