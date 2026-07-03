import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const allowedRoles = ["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN"];
        if (!session || !allowedRoles.includes(session.user?.role || '')) {
            return new NextResponse("Forbidden: Restricted access", { status: 403 });
        }

        const body = await req.json();
        const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
        const res = await fetch(`${NEST_API_INTERNAL_URL}/workflows/complaints/assign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${(session as any).accessToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const err = await res.json();
            return NextResponse.json(err, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("POST assign error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
