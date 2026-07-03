import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
    const res = await fetch(`${NEST_API_INTERNAL_URL}/admin/departments/${params.id}`, {
      method: "PUT",
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
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Update department error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
    const res = await fetch(`${NEST_API_INTERNAL_URL}/admin/departments/${params.id}`, {
      method: "DELETE",
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
    console.error("Delete department error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
