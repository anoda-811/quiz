"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { quizzes } from "@/data/quizzes";
import { useMemo } from "react";

export default function PlayPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [quizIndex, setQuizIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [aiQuizList, setAiQuizList] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const category = params.get("category") || "地理";

  const allQuizzes = Object.values(quizzes).flat();

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const quizList = useMemo(() => {
    if (category === "AI出題") {
      return aiQuizList;
    }

    if (category === "ALL") {
      return shuffleArray(allQuizzes).slice(0, 10);
    }

    const categoryQuiz =
      quizzes[
        category as keyof typeof quizzes
      ] || quizzes["地理"];

    return shuffleArray(categoryQuiz).slice(0, 10);
  }, [category, aiQuizList]);

  const currentQuiz = quizList[quizIndex];

  const theme =
  params.get("theme") || "";

  //--------------------------------
  // 音
  //--------------------------------
  const playSound = (
    type: "buzz" | "correct2" | "wrong" | "nextquiz"
  ) => {
    const sound = new Audio(`/sounds/${type}.mp3`);
    sound.volume = 0.5;

    sound.play().catch((err) => console.log(err));
  };

  //--------------------------------
  // AI取得用
  //--------------------------------
  useEffect(() => {
    if (category !== "AI出題") return;

    const fetchAIQuiz = async () => {
      setLoadingAI(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ theme }),
      });

      const data = await res.json();

      setAiQuizList(data);
      setLoadingAI(false);
    };

    fetchAIQuiz();
  }, [category, theme]);

  //--------------------------------
  // 問題開始演出
  //--------------------------------
  useEffect(() => {
    if (!currentQuiz) return;

    playSound("nextquiz");

    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [quizIndex, currentQuiz]);

  //--------------------------------
  // 問題文1文字表示
  //--------------------------------
  useEffect(() => {
    if (
      !currentQuiz ||
      isAnswering ||
      showResult ||
      showIntro
    )
      return;

    let index = 0;

    const interval = setInterval(() => {
      if (index >= currentQuiz.question.length) {
        clearInterval(interval);
        return;
      }

      setDisplayText(
        currentQuiz.question.slice(0, index + 1)
      );

      index++;
    }, 350);

    return () => clearInterval(interval);
  }, [quizIndex, isAnswering, showResult, showIntro]);

  //--------------------------------
  // SPACE早押し
  //--------------------------------
  const handleBuzz = () => {
    if (
      isAnswering ||
      showResult ||
      showIntro
    ) return;

    playSound("buzz");
    setIsAnswering(true);
    setTimeLeft(15);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleBuzz();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isAnswering, showResult, showIntro]);

  //--------------------------------
  // 回答確定
  //--------------------------------
  const normalize = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .replace(/\s/g, "");

  const handleSubmit = () => {
    const userAnswer = normalize(answer);

    const validAnswers = [
      currentQuiz.answer,
      ...(currentQuiz.aliases || [])
    ].map(normalize);

    const correct = validAnswers.includes(userAnswer);

    setIsCorrect(correct);
    setShowResult(true);
    setIsAnswering(false);

    if (correct) {
      playSound("correct2");
    } else {
      playSound("wrong");
    }
  };

  //--------------------------------
  // 回答タイマー
  //--------------------------------
  useEffect(() => {
    if (!isAnswering || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswering, showResult]);

  //--------------------------------
  // Enterで回答
  //--------------------------------
  const handleAnswerKey = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  //--------------------------------
  // 次の問題
  //--------------------------------
  const handleNextQuestion = () => {
    if (quizIndex >= quizList.length - 1) {
      router.push("/result");
      return;
    }

    setShowIntro(true); // ←ここへ移動
    setQuizIndex((prev) => prev + 1);
    setDisplayText("");
    setAnswer("");
    setIsAnswering(false);
    setShowResult(false);
    setTimeLeft(15);
  };

  // 
  useEffect(() => {
    if (
      !loadingAI &&
      quizList.length > 0 &&
      quizIndex >= quizList.length
    ) {
      router.push("/result");
    }
  }, [
    quizIndex,
    quizList.length,
    loadingAI,
    router
  ]);

  if (loadingAI) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        AIが問題生成中...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">

      {/* intro */}
      {showIntro ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center animate-pulse">

          <h1 className="text-8xl md:text-9xl text-white">
            Q{quizIndex + 1}
          </h1>

          <p className="mt-6 text-xl text-gray-400 tracking-widest">
            CATEGORY : {category}
          </p>

        </div>
      ) : (
        <>
        {/* 通常画面 */}
        <p className="text-gray-400 mb-4">
          Q{quizIndex + 1}
        </p>

        <p className="text-gray-500 mb-8">
          CATEGORY : {category}
        </p>

        <div
          onClick={handleBuzz}
          className="
            border border-white
            w-[700px]
            h-[250px]
            rounded-2xl
            flex
            items-center
            justify-center
            text-3xl
            tracking-widest
            text-center
            px-8
            shadow-[0_0_20px_rgba(255,255,255,0.2)]
            cursor-pointer
            active:scale-[0.99]
            transition
          "
        >
          {showResult
            ? currentQuiz.question
            : displayText}

          {!isAnswering &&
            !showResult &&
            displayText && (
              <span className="animate-pulse ml-2">
                |
              </span>
            )}
        </div>

        {!isAnswering && !showResult && (
          <p className="mt-8 text-gray-400 animate-pulse">
            問題文TAP or SPACEで早押し！
          </p>
        )}

          {/* 回答 */}
          {isAnswering && !showResult && (
            <div className="mt-8 flex flex-col items-center gap-4">

              <p className="text-red-400 text-2xl">
                残り {timeLeft} 秒
              </p>

              <input
                autoFocus
                type="text"
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                onKeyDown={handleAnswerKey}
                className="
                  bg-black
                  border border-white
                  px-6 py-3
                  rounded-xl
                  text-white
                  text-xl
                  text-center
                  outline-none
                "
                placeholder="回答を入力..."
              />

              <p className="text-gray-400 text-sm">
                Enterで確定
              </p>
            </div>
          )}

          {/* 結果 */}
          {showResult && (
            <div className="mt-8 flex flex-col items-center gap-4">

              <h2
                className={`text-5xl ${
                  isCorrect
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {isCorrect ? "正解" : "不正解"}
              </h2>

              <p className="text-gray-300">
                あなたの回答：
                {answer || "未回答"}
              </p>
              <p className="text-gray-400">
                正解：{currentQuiz.answer}
              </p>

              <button
                onClick={handleNextQuestion}
                className="
                  px-8 py-3
                  border border-white
                  rounded-xl
                  hover:bg-white
                  hover:text-black
                  transition-all
                "
              >
                NEXT
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}