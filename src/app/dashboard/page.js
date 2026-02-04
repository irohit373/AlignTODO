'use client';

/**
 * DASHBOARD PAGE
 * This is the main application interface where authenticated users manage their tasks.
 * It demonstrates:
 * 1. Client-side state management with React hooks (useState, useEffect).
 * 2. Integration with Next.js API routes for CRUD operations.
 * 3. Conditional rendering and dynamic styling based on application state.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';

export default function DashboardPage() {
    const router = useRouter();

    // STATE MANAGEMENT
    const [todos, setTodos] = useState([]); // Stores the list of tasks
    const [filter, setFilter] = useState('all'); // Tracks current view: 'all', 'pending', or 'completed'
    const [loading, setLoading] = useState(true); // Manages loading UI state

    // SIDE EFFECTS
    // Automatically re-fetch tasks whenever the filter changes
    useEffect(() => {
        fetchTodos();
    }, [filter]);

    /**
     * FETCH TODOS
     * Calls our API endpoint with the current filter as a query parameter.
     */
    async function fetchTodos() {
        setLoading(true);
        try {
            const res = await fetch(`/api/todos?status=${filter}`);
            const data = await res.json();
            setTodos(data.todos || []);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    }

    /**
     * CREATE TODO
     * Sends a POST request to add a new task to the database.
     */
    async function createTodo(title) {
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            if (!res.ok) throw new Error();
            fetchTodos(); // Refresh list to show new task
        } catch (err) {
            alert('Could not save task. Please check your connection.');
        }
    }

    /**
     * TOGGLE TODO
     * Updates the 'status' of a task (pending <-> completed) using a PATCH request.
     */
    async function toggleTodo(id, currentStatus) {
        try {
            const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
            const res = await fetch(`/api/todos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error();
            fetchTodos(); // Refresh list to reflect status change
        } catch (err) {
            alert('Could not update task status.');
        }
    }

    /**
     * DELETE TODO
     * Permanently removes a task from the database using a DELETE request.
     */
    async function deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            fetchTodos(); // Refresh list after deletion
        } catch (err) {
            alert('Could not delete task.');
        }
    }

    /**
     * LOGOUT
     * Clears the authentication cookie and redirects the user to the login page.
     */
    async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    }

    // DERIVED STATE
    // Calculating stats on-the-fly from the current todos array
    const pending = todos.filter(t => t.status === 'pending').length;
    const completed = todos.filter(t => t.status === 'completed').length;

    return (
        <div className="min-h-screen bg-white">
            {/* NAVIGATION BAR */}
            <header className="border-b-2 border-black">
                <div className="max-w-3xl mx-auto px-6 py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Align TODO</h1>
                    <button
                        onClick={logout}
                        className="text-xs font-bold uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* SUMMARY STATS */}
                <div className="grid grid-cols-3 border-2 border-black mb-12">
                    <div className="p-6 border-r-2 border-black">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-black/50 block mb-1">Total</span>
                        <span className="text-3xl font-black">{todos.length}</span>
                    </div>
                    <div className="p-6 border-r-2 border-black">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-black/50 block mb-1">Pending</span>
                        <span className="text-3xl font-black">{pending}</span>
                    </div>
                    <div className="p-6">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-black/50 block mb-1">Done</span>
                        <span className="text-3xl font-black">{completed}</span>
                    </div>
                </div>

                {/* TASK INPUT FORM */}
                <div className="mb-12">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Add Task</h2>
                    <TodoForm onSubmit={createTodo} />
                </div>

                {/* FILTER CONTROLS */}
                <div className="flex items-end justify-between mb-6 border-b-2 border-black pb-2">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Workspace</h2>
                    <div className="flex gap-2">
                        {['all', 'pending', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest transition-all border border-black ${filter === f
                                    ? 'bg-black text-white'
                                    : 'bg-white text-black hover:bg-black/5'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TASK LIST DISPLAY */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest animate-pulse">Loading_Tasks...</div>
                    ) : todos.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-black/20 font-mono text-xs uppercase tracking-widest text-black/40">
                            No_{filter}_tasks_found
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
