import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = (req as any).nextauth?.token;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
          return true;
        }

        if (pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN';
        }

        if (
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/course') ||
          pathname.startsWith('/lesson') ||
          pathname.startsWith('/module') ||
          pathname.startsWith('/catalog') ||
          pathname.startsWith('/profile')
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/course/:path*',
    '/lesson/:path*',
    '/module/:path*',
    '/catalog/:path*',
    '/admin/:path*',
    '/profile/:path*',
  ],
};
