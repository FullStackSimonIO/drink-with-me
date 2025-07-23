// components/ProfileCard/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Me } from "@/app/lib/hooks/useMe";
import { motion } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  Calendar,
  Star,
  Zap,
  Award,
  Clock,
  BarChart3,
  Coins,
  Target,
  Activity,
  Crown,
} from "lucide-react";

interface ProfileStats {
  totalDrinks: number;
  avgPerMonth: number;
  bestMonth: string;
  daysActive: number;
  streak: number;
  rank: number;
  winRate: number;
  achievements: string[];
}

export function ProfileCard({ user }: { user: Me }) {
  const [amt, setAmt] = useState(1);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "achievements"
  >("overview");
  const isAdmin = user.role === "ADMIN";

  // Fetch additional profile statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/profile/stats?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  const addFreeBeer = async () => {
    const res = await fetch("/api/freibier", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: amt }),
    });
    if (res.ok) {
      toast.success(`${amt} Freibier hinzugefügt! 🍺`);
    } else {
      toast.error("Fehler beim Hinzufügen von Freibier");
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank <= 3) return "from-gray-300 to-gray-500";
    if (rank <= 10) return "from-orange-400 to-orange-600";
    return "from-blue-400 to-blue-600";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5" />;
    if (rank <= 3) return <Trophy className="w-5 h-5" />;
    if (rank <= 10) return <Award className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  const levelProgress = (user.levelProgress! / 100) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 border border-white/10 shadow-2xl"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 p-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-24 h-24 mx-auto mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-50"></div>
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                fill
                className="relative z-10 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-white/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-white/20"
            >
              LV {user.level}
            </motion.div>
          </motion.div>

          {/* Name & Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1"
          >
            {user.name}
          </motion.h2>

          {/* Rank Display */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 mb-4"
            >
              <div
                className={`p-1 rounded-full bg-gradient-to-r ${getRankColor(stats.rank)}`}
              >
                {getRankIcon(stats.rank)}
              </div>
              <span className="text-white/90 text-sm font-medium">
                Rang #{stats.rank}
              </span>
            </motion.div>
          )}

          {/* Level Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Level Progress</span>
              <span>{user.levelProgress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          {[
            { id: "overview", label: "Übersicht", icon: BarChart3 },
            { id: "stats", label: "Statistiken", icon: TrendingUp },
            { id: "achievements", label: "Erfolge", icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/60 text-xs">Balance</span>
                  </div>
                  <p className="text-white text-lg font-bold">
                    {user.balance} €
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-xs">Dieses Jahr</span>
                  </div>
                  <p className="text-white text-lg font-bold">
                    {user.currScore}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-white/60 text-xs">Tokens</span>
                  </div>
                  <p className="text-white text-lg font-bold">
                    {user.tokens || 0}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-white/60 text-xs">Level</span>
                  </div>
                  <p className="text-white text-lg font-bold">{user.level}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-white/60 text-sm">Lade Statistiken...</p>
                </div>
              ) : stats ? (
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-orange-400" />
                        <span className="text-white/80 text-sm">
                          Durchschnitt/Monat
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {stats.avgPerMonth}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-white/80 text-sm">
                          Aktive Tage
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {stats.daysActive}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white/80 text-sm">
                          Beste Serie
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {stats.streak} Tage
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/80 text-sm">
                          Gewinnrate
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {stats.winRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-white/60 py-4">
                  Keine Statistiken verfügbar
                </p>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-white/60 text-sm">Lade Erfolge...</p>
                </div>
              ) : stats?.achievements && stats.achievements.length > 0 ? (
                <div className="space-y-2">
                  {stats.achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-white/90 text-sm">
                        {achievement}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-white/20 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">
                    Noch keine Erfolge freigeschaltet
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    Trinke mehr Bier um Erfolge zu sammeln!
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Admin Section */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg p-4 border border-red-500/30">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                Admin Panel
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-white/80 text-xs mb-1">
                    Anzahl Freibier:
                  </label>
                  <input
                    type="number"
                    value={amt}
                    min={1}
                    onChange={(e) => setAmt(Number(e.target.value))}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white text-sm placeholder-white/40 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Anzahl eingeben..."
                  />
                </div>

                <Button
                  onClick={addFreeBeer}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  🍺 Freibier hinzufügen
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
