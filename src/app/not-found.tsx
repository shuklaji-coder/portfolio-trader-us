import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030508] text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white mb-4">
        404
      </h1>
      <p className="text-slate-400 mb-6">LIQUIDITY LEVEL NOT FOUND // INVALID ROUTE</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full border border-gold/40 bg-gold/15 text-gold hover:bg-gold/25 transition-all text-xs font-bold"
      >
        RETURN TO TERMINAL
      </Link>
    </div>
  );
}

