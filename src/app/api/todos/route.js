// GET /api/todos - Get all todos for current user
// POST /api/todos - Create new todo

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let sql = 'SELECT * FROM todos WHERE user_id = $1';
        const params = [user.userId];

        if (status && status !== 'all') {
            sql += ' AND status = $2';
            params.push(status);
        }
        sql += ' ORDER BY id DESC';

        const result = await query(sql, params);
        return NextResponse.json({ todos: result.rows });
    } catch (error) {
        console.error('Get todos error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { title } = await request.json();

        if (!title?.trim()) {
            return NextResponse.json({ error: 'Title required' }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *',
            [title.trim(), user.userId]
        );

        return NextResponse.json({ todo: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Create todo error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
