import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // You can add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Protect these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/maps/:path*',
    '/courses/:path*',
    '/account/:path*',
  ],
};
