'use client';

// Reusable form for both login and register pages - Pure Simple Edge Design

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthForm({ mode = 'login' }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isLogin = mode === 'login';

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`/api/auth/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-sm border-2 border-black p-8 bg-white">
                <header className="mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
                        {isLogin ? 'Enter' : 'Join'}
                    </h1>
                    <div className="h-1 w-12 bg-black"></div>
                </header>

                {error && (
                    <div className="bg-black text-white p-4 font-bold text-xs uppercase tracking-widest mb-6">
                        ERROR: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-2 border-black p-3 font-bold text-sm outline-none focus:bg-black/5"
                            placeholder="USER@DOMAIN.COM"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-black p-3 font-bold text-sm outline-none focus:bg-black/5"
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-sm border-2 border-black hover:bg-white hover:text-black transition-colors disabled:bg-black/20"
                    >
                        {loading ? 'PROCESSING...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <footer className="mt-8 pt-6 border-t border-black/10">
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest leading-loose">
                        {isLogin ? "Need access? " : 'Already a member? '}
                        <Link href={isLogin ? '/register' : '/login'} className="underline underline-offset-4 hover:bg-black hover:text-white px-1">
                            {isLogin ? 'Create Account' : 'Login instead'}
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
