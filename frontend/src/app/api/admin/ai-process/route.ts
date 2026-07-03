import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
    const res = await fetch(`${NEST_API_INTERNAL_URL}/admin/ai-process`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(err, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI process error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
