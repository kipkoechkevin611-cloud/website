import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export function middleware(request: NextRequest) {
  // Disable admin route protection - allow direct access
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
