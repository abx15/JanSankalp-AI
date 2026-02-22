import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ 
        error: 'No session found',
        authenticated: false 
      }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.user?.email,
        name: session.user?.name,
        role: session.user?.role,
        id: session.user?.id
      },
      expires: session.expires
    });
  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json({ 
      error: 'Session refresh failed',
      authenticated: false 
    }, { status: 500 });
  }
}
