"use client";

import Link from "next/link";

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8">

      <h1 className="text-5xl tracking-widest">
        RESULT
      </h1>

      <p className="text-gray-400">
        お疲れ様でした
      </p>

      <Link
        href="/"
        className="
          px-8 py-3
          border border-white
          rounded-xl
          hover:bg-white
          hover:text-black
          transition-all
        "
      >
        HOMEへ戻る
      </Link>
    </main>
  );
}