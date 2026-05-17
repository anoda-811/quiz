"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AIPage() {
  const [theme, setTheme] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (!theme) return;

    router.push(
      `/play?category=AI出題&theme=${encodeURIComponent(
        theme
      )}`
    );
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-4xl mb-8">
        AIクイズ生成
      </h1>

      <input
        value={theme}
        onChange={(e) =>
          setTheme(e.target.value)
        }
        placeholder="例: デスノート"
        className="
          bg-black
          border border-white
          px-6 py-3
          rounded-xl
          text-center
        "
      />

      <button
        onClick={handleStart}
        className="
          mt-8
          px-8 py-3
          border border-white
          rounded-xl
          hover:bg-white
          hover:text-black
        "
      >
        START
      </button>
    </main>
  );
}