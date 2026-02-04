// Home page - landing page with links to login/register

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 text-center p-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full mx-4 transition-all hover:border-white/20">
        <div className="mb-8">
          <div className="inline-block p-4 rounded-2xl bg-blue-600/10 mb-6 border border-blue-500/20 shadow-inner">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-white via-blue-100 to-gray-400 bg-clip-text text-transparent">
            Align TODO
          </h1>
          <p className="text-gray-400 text-lg">
            Elevate your productivity. <br />
            <span className="text-sm opacity-60">Created by <a href="https://irohit373.me" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline decoration-blue-500/30 transition-all">iRohit373</a></span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/40 text-center"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="w-full border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Decorative footer element */}
      <div className="absolute bottom-8 text-white/20 text-xs font-mono tracking-widest uppercase z-10">
        Align your life • Achieve more
      </div>
    </div>
  );
}
