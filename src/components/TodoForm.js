'use client';

import { useState } from 'react';

export default function TodoForm({ onSubmit }) {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        // Only submit if there is text
        const cleanTitle = title.trim();
        if (!cleanTitle) return;

        setLoading(true);
        try {
            await onSubmit(cleanTitle);
            setTitle(''); // Clear input after success
        } catch (err) {
            alert('Failed to add task');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 border rounded p-2 outline-none focus:border-blue-500"
                disabled={loading}
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
                {loading ? '...' : 'Add'}
            </button>
        </form>
    );
}
