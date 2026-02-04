// POST /api/auth/login - Sign in user

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // Find user by email
        const result = await query('SELECT id, email, password FROM users WHERE email = $1', [email.toLowerCase()]);
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = result.rows[0];

        // Check password
        const valid = await verifyPassword(password, user.password);
        if (!valid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        const token = createToken(user.id, user.email);
        await setAuthCookie(token);

        return NextResponse.json({ message: 'Logged in', user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
