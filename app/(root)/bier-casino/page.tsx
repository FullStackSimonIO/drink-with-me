"use client";
import React from "react";
import useSWR from "swr";
import { toast } from "sonner";
import CasinoWheel from "@/components/CasinoWheel";

type Me = {
  id: string;
  tokens: number;
};

export default function CasinoPage() {
  interface FetchMeResponse {
    id: string;
    tokens: number;
  }

  interface UseSWRResponse {
    data: Me | undefined;
    mutate: () => Promise<Me | undefined>;
  }

  const { data: me, mutate }: UseSWRResponse = useSWR<Me>(
    "/api/me",
    (url: string): Promise<FetchMeResponse> =>
      fetch(url).then((r: Response) => r.json())
  );

  const handleSpin = async (index: number) => {
    // 1) Spin-Request
    const res = await fetch("/api/casino/spin", { method: "POST" });
    if (!res.ok) {
      const { error } = await res.json();
      toast.error(
        error === "No tokens" ? "Keine Tokens mehr!" : "Spin fehlgeschlagen"
      );
      return;
    }
    const { prizeIndex, prizeAmount } = await res.json();

    // 2) Feedback
    if (prizeAmount > 0) {
      toast.success(`Glückwunsch! Du gewinnst ${prizeAmount} Bier(e). 🍻`);
    } else {
      toast.info("Leider Niete 😢");
    }

    // 3) Refetch von /api/me (Tokens und Balance frisch!)
    mutate();
  };

  if (!me) return <p className="text-center py-20">Loading…</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-light-800 dark:bg-dark-300">
      <h1 className="text-3xl font-bold mb-6 text-white">Bier-Casino</h1>
      <CasinoWheel onSpin={handleSpin} tokens={me.tokens} />
    </main>
  );
}
