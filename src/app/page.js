// Home page - minimalist edge design

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full border-2 border-black p-10 bg-white">
        <div className="mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 border-b-4 border-black inline-block">
            Align TODO
          </h1>
          <p className="text-lg font-medium text-black/70 leading-tight mt-6">
            PURE PRODUCTIVITY. <br />
            NO FRILLS. NO DISTRACTIONS.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="w-full bg-black text-white px-8 py-4 font-bold text-center border-2 border-black hover:bg-white hover:text-black transition-colors uppercase tracking-widest"
          >
            Enter App
          </Link>
          <Link
            href="/register"
            className="w-full bg-white text-black px-8 py-4 font-bold text-center border-2 border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-black/10 text-[10px] font-mono uppercase tracking-[0.2em] text-black/40">
          Built by <a href="https://irohit373.me" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">iRohit373</a>
        </div>
      </div>
    </div>
  );
}
