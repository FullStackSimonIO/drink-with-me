// components/home/DrinkTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Beer, Loader2, Trophy, Star, Zap } from "lucide-react";
import { Button } from "../ui/button";
import type { Role } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export type UserType = {
  id: string;
  level: number;
  clerkUserId: string | null;
  role: Role;
  name: string;
  profileImage: string | null;
  balance: number;
  currScore: number;
};

export default React.memo(function DrinkTable({
  users,
  me,
}: {
  users: UserType[];
  me: UserType | null;
}) {
  const router = useRouter();
  const meId = me?.id;
  const isAdmin = me?.role === "ADMIN";

  // hier merken wir uns, bei welcher Zeile gerade ein Request läuft
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sort-Key State
  const [sortKey, setSortKey] = useState<"currScore" | "balance" | "name">(
    "currScore"
  );

  // Memoized sorted array
  const sortedUsers = useMemo(() => {
    const arr = [...users];
    switch (sortKey) {
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "balance":
        return arr.sort((a, b) => b.balance - a.balance);
      case "currScore":
      default:
        return arr.sort((a, b) => b.currScore - a.currScore);
    }
  }, [users, sortKey]);

  // universeller Handler für "Bier trinken"
  const handleDrink = async (userId: string) => {
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}/drink`, {
        method: "POST",
      });
      if (!res.ok) {
        // wenn die API zurückweist, zeige den Fehlertext
        const text = await res.text();
        toast.error(`Fehler: ${text}`);
      } else {
        // falls alles gut, evtl. die neuen Werte auslesen
        const { user: updated } = await res.json();
        toast.success("🍻 Prost!");
      }
    } catch (err: any) {
      toast.error(`Netzwerkfehler: ${err.message}`);
    } finally {
      setLoadingId(null);
      router.refresh();
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Star className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Zap className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="text-white/60 font-bold">#{index + 1}</span>;
    }
  };

  const getRankGradient = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-500/20 to-orange-500/20";
      case 1:
        return "from-gray-400/20 to-gray-600/20";
      case 2:
        return "from-orange-500/20 to-red-500/20";
      default:
        return "from-purple-500/10 to-blue-500/10";
    }
  };

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Wer trinkt am meisten? Hier siehst du alle Teilnehmer im Ranking!
          </p>
        </motion.div>

        {/* Sort Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-1 border border-white/10 shadow-2xl">
            <div className="flex flex-wrap gap-1">
              {[
                { key: "currScore" as const, label: "🏆 Zähler", icon: Trophy },
                { key: "balance" as const, label: "🪙 Guthaben", icon: Star },
                { key: "name" as const, label: "📝 Name", icon: Zap },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortKey(key)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
                    sortKey === key
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile Cards */}
        <div className="block lg:hidden space-y-4">
          {sortedUsers.map((user, index) => {
            const isMe = user.id === meId;
            const isLoading = loadingId === user.id;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br ${getRankGradient(
                  index
                )} border border-white/10 shadow-2xl ${
                  isMe ? "ring-2 ring-yellow-400/50" : ""
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">{getRankIcon(index)}</div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-3 hover:scale-105 transition-transform">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 p-0.5">
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                  {user.profileImage ? (
                                    <Image
                                      src={user.profileImage}
                                      alt={user.name}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-white font-bold text-lg">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isMe && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <span className="text-black text-xs font-bold">
                                    Du
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-left">
                              <h3 className="text-white font-bold text-lg">
                                {user.name}
                              </h3>
                              <p className="text-white/60 text-sm">
                                Level {user.level}
                              </p>
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="backdrop-blur-xl bg-slate-900/90 border border-white/20">
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Profil von {user.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 text-white/80">
                            <p>Level: {user.level}</p>
                            <p>Rolle: {user.role}</p>
                            <p>Biere: {user.currScore}</p>
                            <p>Guthaben: {user.balance}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <p className="text-white/60 text-xs uppercase tracking-wider">
                        Guthaben
                      </p>
                      <p
                        className={cn(
                          "text-xl font-bold",
                          user.balance > 0 ? "text-green-400" : "text-red-400"
                        )}
                      >
                        {user.balance}
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <p className="text-white/60 text-xs uppercase tracking-wider">
                        Biere
                      </p>
                      <p className="text-xl font-bold text-blue-400">
                        {user.currScore}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    {isAdmin && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg"
                        onClick={async () => {
                          setLoadingId(user.id);
                          try {
                            await fetch(`/api/users/${user.id}/balance`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ delta: +1 }),
                            });
                          } catch {}
                          setLoadingId(null);
                          router.refresh();
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    )}

                    {(isAdmin || isMe) && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black border-0 shadow-lg font-semibold"
                        onClick={() => handleDrink(user.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Beer className="w-4 h-4 mr-1" />
                            Prost!
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block"
        >
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Rang
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Spieler
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Guthaben
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Biere
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => {
                    const isMe = user.id === meId;
                    const isLoading = loadingId === user.id;

                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={cn(
                          "border-b border-white/5 hover:bg-white/5 transition-all duration-300",
                          isMe &&
                            "bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(index)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="flex items-center gap-3 hover:scale-105 transition-transform">
                                <div className="relative">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                      {user.profileImage ? (
                                        <Image
                                          src={user.profileImage}
                                          alt={user.name}
                                          width={40}
                                          height={40}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-white font-bold">
                                          {user.name.charAt(0).toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {isMe && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                      <span className="text-black text-xs font-bold">
                                        Du
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-left">
                                  <p className="text-white font-semibold">
                                    {user.name}
                                  </p>
                                  <p className="text-white/60 text-sm">
                                    Level {user.level}
                                  </p>
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="backdrop-blur-xl bg-slate-900/90 border border-white/20">
                              <DialogHeader>
                                <DialogTitle className="text-white">
                                  Profil von {user.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 text-white/80">
                                <p>Level: {user.level}</p>
                                <p>Rolle: {user.role}</p>
                                <p>Biere: {user.currScore}</p>
                                <p>Guthaben: {user.balance}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={cn(
                              "text-lg font-bold",
                              user.balance > 0
                                ? "text-green-400"
                                : "text-red-400"
                            )}
                          >
                            {user.balance}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg font-bold text-blue-400">
                            {user.currScore}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {isAdmin && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg"
                                onClick={async () => {
                                  setLoadingId(user.id);
                                  try {
                                    await fetch(
                                      `/api/users/${user.id}/balance`,
                                      {
                                        method: "PATCH",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ delta: +1 }),
                                      }
                                    );
                                  } catch {}
                                  setLoadingId(null);
                                  router.refresh();
                                }}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </Button>
                            )}

                            {(isAdmin || isMe) && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black border-0 shadow-lg font-semibold"
                                onClick={() => handleDrink(user.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Beer className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
