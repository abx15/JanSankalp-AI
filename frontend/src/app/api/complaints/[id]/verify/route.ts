import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "ADMIN") {
            return new NextResponse("Forbidden: Admin only", { status: 403 });
        }

        const body = await req.json();
        const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
        const res = await fetch(`${NEST_API_INTERNAL_URL}/workflows/complaints/${params.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${(session as any).accessToken}`,
            },
            body: JSON.stringify({ status: body.status }),
        });

        if (!res.ok) {
            const err = await res.json();
            return NextResponse.json(err, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("PATCH verify error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
