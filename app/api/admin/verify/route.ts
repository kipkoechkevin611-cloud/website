import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Accept access if isAdmin === true OR role === "admin"
    const isAdmin = decoded.isAdmin === true;
    const hasAdminRole = decoded.role === 'admin';

    if (!isAdmin && !hasAdminRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
        role: decoded.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 401 }
    );
  }
}
