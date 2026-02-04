// POST /api/auth/register - Create new user account

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Basic validation
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be 6+ characters' }, { status: 400 });
        }

        // Check if email already exists
        const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        // Create user with hashed password
        const hashedPassword = await hashPassword(password);
        const result = await query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email.toLowerCase(), hashedPassword]
        );
        const user = result.rows[0];

        // Create session token and save to cookie
        const token = createToken(user.id, user.email);
        await setAuthCookie(token);

        return NextResponse.json({ message: 'Account created', user }, { status: 201 });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
