import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
    const res = await fetch(`${NEST_API_INTERNAL_URL}/admin/departments`, {
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
    console.error("Fetch departments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
    const res = await fetch(`${NEST_API_INTERNAL_URL}/admin/departments`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(err, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Create department error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
