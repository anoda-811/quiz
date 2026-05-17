"use client";

import { useRouter } from "next/navigation";
import { Zen_Old_Mincho } from "next/font/google";

const zenOld = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: ["400"],
});

const categories = [
  "雑学",
  "地理",
  "歴史",
  "アニメ",
  "音楽",
  "スポーツ",
  "ALL",
  "AI出題"
];

export default function CategoryPage() {
  const router = useRouter();

  const handleSelect = (category: string) => {
    if (category === "AI出題") {
      router.push("/ai");
    } else {
      router.push(`/play?category=${category}`);
    }
  };

  const playSound = () => {
    const sound = new Audio("/sounds/決定.mp3");
    sound.volume = 0.5;
    sound.play();
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1
        className={`${zenOld.className} text-5xl tracking-[0.2em] mb-10`}
      >
        CATEGORY
      </h1>

      <p className="text-gray-400 mb-10">
        挑むジャンルを選べ
      </p>

      <div className="grid grid-cols-2 gap-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              // playSound();
              handleSelect(category);
            }}
            className="
              w-40 h-20
              border border-white
              rounded-xl
              hover:bg-white
              hover:text-black
              hover:shadow-[0_0_15px_white]
              transition-all
            "
          >
            {category}
          </button>
        ))}
      </div>
    </main>
  );
}