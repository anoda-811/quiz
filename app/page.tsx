"use client";

import Link from "next/link";
import { Zen_Old_Mincho } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";

const zenOld = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: ["400"],
});

export default function QuizHome() {
  const [mode, setMode] = useState<"normal" | "time" | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const router = useRouter();


  const playSound = () => {
    const sound = new Audio("/sounds/データ表示3.mp3");
    sound.volume = 0.5;
    sound.play();
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">

      {/* タイトル */}
      <h1
        className={`
          ${zenOld.className}
          text-6xl md:text-8xl
          tracking-[0.3em]
          mb-4
          animate-pulse
        `}
      >
        君のクイズ
      </h1>

      {/* <p className="text-gray-400 mb-12 tracking-widest">
        押せるか？
      </p> */}

      {/* Start */}
      <Link
        href="/category"
        onClick={playSound}
        className="
          mt-20
          px-10 py-4
          border border-white
          rounded-xl
          text-xl
          tracking-widest
          hover:bg-white
          hover:text-black
          hover:shadow-[0_0_20px_white]
          transition-all
        "
      >
        ▶ START
      </Link>
    </main>
  );
}