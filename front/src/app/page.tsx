"use client";

import { makeChat } from "~/@core/main";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24 gap-4">
      {makeChat()}
    </main>
  );
}
