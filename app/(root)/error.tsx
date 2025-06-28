// app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Ein Fehler ist aufgetreten</h1>
      <p className="mb-8">{error.message}</p>
      <button onClick={() => reset()} className="btn">
        Erneut versuchen
      </button>
    </main>
  );
}
