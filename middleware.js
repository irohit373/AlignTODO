// Middleware runs before every request
// Protects /dashboard route - redirects to /login if not authenticated

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const token = request.cookies.get('auth-token')?.value;
    const path = request.nextUrl.pathname;

    // Check if trying to access dashboard without token
    if (path.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Verify the token is valid
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // If logged in, redirect away from login/register pages
    if ((path === '/login' || path === '/register') && token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch {
            // Token invalid, let them access login
        }
    }

    return NextResponse.next();
}

// Only run middleware on these routes
export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
