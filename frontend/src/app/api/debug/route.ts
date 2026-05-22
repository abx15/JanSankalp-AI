import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    
    return NextResponse.json({
      message: "Debug info",
      session: session,
      env: {
        AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "NOT_SET",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
