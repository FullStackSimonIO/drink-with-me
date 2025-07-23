"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Coins, Zap, Trophy, Star } from "lucide-react";
import CasinoWheel from "@/components/CasinoWheel";

type Me = {
  id: string;
  tokens: number;
  balance: number;
  name: string;
};

export default function CasinoPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  interface FetchMeResponse {
    id: string;
    tokens: number;
    balance: number;
    name: string;
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
    if (isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);

    try {
      // 1) Spin-Request
      const res = await fetch("/api/casino/spin", { method: "POST" });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(
          error === "No tokens"
            ? "❌ Keine Tokens mehr!"
            : "❌ Spin fehlgeschlagen"
        );
        return;
      }
      const { prizeIndex, prizeAmount } = await res.json();

      // Wait for wheel animation
      setTimeout(() => {
        // 2) Feedback
        if (prizeAmount > 0) {
          setLastWin(prizeAmount);
          toast.success(
            `🎉 Glückwunsch! Du gewinnst ${prizeAmount} Bier(e)! 🍻`
          );
        } else {
          toast.info("😢 Leider Niete - Versuch es nochmal!");
        }

        // 3) Refetch von /api/me (Tokens und Balance frisch!)
        mutate();
      }, 3000); // Match wheel animation duration
    } catch (error) {
      toast.error("❌ Netzwerkfehler!");
    } finally {
      setTimeout(() => setIsSpinning(false), 3000);
    }
  };

  if (!me)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin"></div>
          <span className="text-lg">Lade Casino...</span>
        </div>
      </div>
    );

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-8 pb-4 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Bier
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Casino
              </span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto">
              Drehe das Glücksrad und gewinne Biere! 🎰🍻
            </p>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="px-4 sm:px-6 lg:px-8 mb-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tokens */}
              <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/10 shadow-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                      Tokens
                    </p>
                    <p className="text-white text-3xl font-bold mt-1">
                      {me.tokens}
                    </p>
                  </div>
                  <Coins className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
              </div>

              {/* Balance */}
              <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10 shadow-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                      Guthaben
                    </p>
                    <p className="text-white text-3xl font-bold mt-1">
                      {me.balance}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
              </div>
            </div>

            {/* Last Win Display */}
            {lastWin && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-2xl font-bold text-lg shadow-2xl">
                  <Star className="w-6 h-6" />
                  Gewinn: {lastWin} Bier(e)!
                  <Star className="w-6 h-6" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Casino Wheel Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-2xl mx-auto"
          >
            <CasinoWheel
              onSpin={handleSpin}
              tokens={me.tokens}
              isSpinning={isSpinning}
            />
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="px-4 sm:px-6 lg:px-8 pb-8"
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-4">
                🎯 Spielregeln
              </h3>
              <div className="space-y-2 text-white/70 text-sm">
                <p>• Verwende 1 Token pro Dreh</p>
                <p>• Gewinne Biere oder Nieten</p>
                <p>• Sammle Tokens durch Aktivitäten</p>
                <p>• Viel Glück beim Spielen! 🍀</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
