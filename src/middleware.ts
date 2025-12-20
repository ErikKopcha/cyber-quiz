// Next.js Middleware for Protected Routes
// DISABLED: Using client-side AuthGuard instead to avoid race conditions with Firebase Auth

import { ROUTES } from '@/constants/routes';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle root redirect - everything else handled by client-side guards
  if (pathname === '/') {
    // Always redirect to dashboard, AuthGuard will handle auth check
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
