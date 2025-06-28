// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Seite nicht gefunden</h1>
      <p className="mb-8">Sorry, wir konnten die Seite nicht finden.</p>
      <Link href="/" className="btn">
        Zurück zur Startseite
      </Link>
    </main>
  );
}
