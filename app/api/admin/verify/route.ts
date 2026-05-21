import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;

    // Disable admin verification - allow direct access
    // if (!token) {
    //   return NextResponse.json(
    //     { error: 'No token provided' },
    //     { status: 401 }
    //   );
    // }

    const decoded = token ? verifyToken(token) : null;

    // Disable admin verification - allow direct access
    // if (!decoded) {
    //   return NextResponse.json(
    //     { error: 'Invalid or expired token' },
    //     { status: 401 }
    //   );
    // }

    // Accept access if isAdmin === true OR role === "admin"
    // const isAdmin = decoded?.isAdmin === true;
    // const hasAdminRole = decoded?.role === 'admin';

    // if (!isAdmin && !hasAdminRole) {
    //   console.log('Verify API access denied:', {
    //     isAdmin: decoded?.isAdmin,
    //     role: decoded?.role,
    //     isAdminType: typeof decoded?.isAdmin,
    //     roleType: typeof decoded?.role
    //   });
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    return NextResponse.json({
      success: true,
      user: {
        id: decoded?.userId || 'admin',
        email: decoded?.email || 'admin@ilosunot.com',
        isAdmin: true,
        role: 'admin',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 401 }
    );
  }
}
