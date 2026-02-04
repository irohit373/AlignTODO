// Authentication utilities
// Handles password hashing, JWT tokens, and cookies

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// Hash a password before storing in database
export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

// Check if entered password matches stored hash
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

// Create a JWT token for a user
export function createToken(userId, email) {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Verify and decode a JWT token
export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

// Save token to HTTP-only cookie (secure, can't be accessed by JavaScript)
export async function setAuthCookie(token) {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

// Get token from cookie
export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('auth-token')?.value || null;
}

// Remove auth cookie (for logout)
export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}

// Get current logged-in user from cookie
export async function getCurrentUser() {
    const token = await getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}
