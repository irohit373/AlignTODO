// PATCH /api/todos/[id] - Update todo (title or status)
// DELETE /api/todos/[id] - Delete todo

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { id } = await params;
        const { title, status } = await request.json();

        const updates = [];
        const values = [];
        let i = 1;

        if (title !== undefined) {
            updates.push(`title = $${i++}`);
            values.push(title.trim());
        }
        if (status !== undefined) {
            updates.push(`status = $${i++}`);
            values.push(status);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
        }

        values.push(id, user.userId);
        const sql = `UPDATE todos SET ${updates.join(', ')} WHERE id = $${i++} AND user_id = $${i} RETURNING *`;

        const result = await query(sql, values);
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json({ todo: result.rows[0] });
    } catch (error) {
        console.error('Update todo error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { id } = await params;

        const result = await query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, user.userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        console.error('Delete todo error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
