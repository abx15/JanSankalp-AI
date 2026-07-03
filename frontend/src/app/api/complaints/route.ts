import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const url = new URL(req.url);
        const searchParams = url.searchParams.toString();

        const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
        const res = await fetch(`${NEST_API_INTERNAL_URL}/workflows/complaints?${searchParams}`, {
            headers: {
                'Authorization': `Bearer ${(session as any).accessToken}`,
            },
        });

        if (!res.ok) {
            const err = await res.json();
            return NextResponse.json(err, { status: res.status });
        }

        const result = await res.json();
        // Return only the data payload for compatibility with the frontend modules structure
        return NextResponse.json(result.data || result);
    } catch (error: any) {
        console.error("GET complaints error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
        const res = await fetch(`${NEST_API_INTERNAL_URL}/workflows/complaints`, {
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
        console.error("POST complaint error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
