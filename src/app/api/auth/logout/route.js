// POST /api/auth/logout - Sign out user

import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
    await removeAuthCookie();
    return NextResponse.json({ message: 'Logged out' });
}
