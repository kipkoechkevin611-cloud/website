import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;

  const adminPaths = ['/admin'];
  const loginPath = '/admin/login';

  const isAdminPath = adminPaths.some(path => request.nextUrl.pathname.startsWith(path));
  const isLoginPath = request.nextUrl.pathname === loginPath;

  // Allow access to login page
  if (isLoginPath) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Accept access if isAdmin === true OR role === "admin"
    const isAdmin = decoded.isAdmin === true;
    const hasAdminRole = decoded.role === 'admin';

    if (!isAdmin && !hasAdminRole) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
