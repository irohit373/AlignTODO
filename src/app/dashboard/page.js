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
        <div className="min-h-screen bg-gray-50">
            {/* NAVIGATION BAR */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">Align TODO</h1>
                    <button
                        onClick={logout}
                        className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* SUMMARY STATS */}
                <div className="flex gap-6 mb-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm">
                    <div className="flex flex-col">
                        <span className="text-gray-500">Total</span>
                        <span className="text-lg font-bold">{todos.length}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500">Pending</span>
                        <span className="text-lg font-bold text-orange-500">{pending}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500">Completed</span>
                        <span className="text-lg font-bold text-green-500">{completed}</span>
                    </div>
                </div>

                {/* TASK INPUT FORM */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">New Task</h2>
                    <TodoForm onSubmit={createTodo} />
                </div>

                {/* FILTER CONTROLS */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">My Tasks</h2>
                    <div className="flex bg-gray-200 p-1 rounded-md">
                        {['all', 'pending', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1 rounded text-xs font-bold transition-all ${filter === f
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TASK LIST DISPLAY */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="py-10 text-center text-gray-400">Loading your tasks...</div>
                    ) : todos.length === 0 ? (
                        <div className="py-10 text-center bg-white border border-dashed border-gray-300 rounded-lg text-gray-400">
                            No {filter !== 'all' ? filter : ''} tasks found.
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
