import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
        const res = await fetch(`${NEST_API_INTERNAL_URL}/auth/resend-verification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const err = await res.json();
            return NextResponse.json(err, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("❌ Failed to resend verification email:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to send verification email",
        }, { status: 500 });
    }
}
