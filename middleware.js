// Middleware runs before every request
// Protects /dashboard route - redirects to /login if not authenticated

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const token = request.cookies.get('auth-token')?.value;
    const path = request.nextUrl.pathname;

    const isAuthRoute = path === '/login' || path === '/register';
    const isProtectedRoute = path.startsWith('/dashboard');

    // 1. If trying to access dashboard without a token, redirect to login
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. If logged in (has token), prevent access to login/register - redirect to dashboard
    if (isAuthRoute && token) {
        try {
            // Optional: Verify token validity here using jose
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch (err) {
            // Token invalid or expired, allow access to login/register to get a new one
            return NextResponse.next();
        }
    }

    // 3. Verify token for dashboard access (even if token exists, it might be invalid)
    if (isProtectedRoute && token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (err) {
            // Invalid token, clear it and redirect to login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth-token');
            return response;
        }
    }

    return NextResponse.next();
}

// Ensure middleware runs on all relevant routes
export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
