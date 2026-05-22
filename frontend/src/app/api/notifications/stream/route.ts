import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // For now, return a simple JSON response instead of streaming
    // We'll implement real-time updates later
    return NextResponse.json({ 
        type: "connected",
        message: "Notification system connected",
        timestamp: new Date().toISOString()
    });
}
