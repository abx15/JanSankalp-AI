import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const NEST_API_INTERNAL_URL = process.env.NEST_API_INTERNAL_URL || "http://nest-api:3000";
    const res = await fetch(`${NEST_API_INTERNAL_URL}/admin/stats`, {
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
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
