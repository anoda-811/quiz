"use client";

import { Suspense } from "react";
import PlayContent from "./PlayContent";

export default function PlayPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    }>
      <PlayContent />
    </Suspense>
  );
}