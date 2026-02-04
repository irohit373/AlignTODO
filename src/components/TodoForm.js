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
        <form onSubmit={handleSubmit} className="flex gap-0 mb-4 border-2 border-black">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="WHAT NEEDS TO BE DONE?"
                className="flex-1 p-4 outline-none font-bold uppercase tracking-widest text-sm placeholder:text-black/20"
                disabled={loading}
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black border-l-2 border-black transition-colors disabled:bg-gray-200"
            >
                {loading ? '...' : 'Add'}
            </button>
        </form>
    );
}
