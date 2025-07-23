// components/coo.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

type MeRecord = {
  id: string;
  clerkUserId: string | null;
  name: string;
  balance: number;
  currScore: number;
  profileImage: string | null;
};

const Hero = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [me, setMe] = useState<MeRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    setLoading(true);
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: MeRecord) => {
        setMe(data);
      })
      .catch((err) => {
        console.error("Fetch /api/me failed:", err);
        setMe(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, user]);

  function scrollToSection(e: React.MouseEvent) {
    e.preventDefault();
    document
      .querySelector("#monthlyWinner")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  const StatCard = ({
    label,
    value,
    icon,
    gradient,
  }: {
    label: string;
    value: string | number;
    icon: string;
    gradient: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 backdrop-blur-xl bg-gradient-to-br ${gradient} shadow-2xl border border-white/20`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wider">
            {label}
          </p>
          <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mt-1">
            {value}
          </p>
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl">{icon}</div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
    </motion.div>
  );

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter mb-4"
            >
              <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Promillecrew
              </span>{" "}
              <span className="bg-gradient-to-r  bg-clip-text from-orange-400 via-amber-500 to-yellow-500 text-transparent">
                Biertracker
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-4 sm:mt-6 leading-relaxed"
            >
              Die ultimative Plattform für digitales Bier-Tracking mit Freunden
            </motion.p>
          </motion.div>

          {/* User Stats Section */}
          {isLoaded && isSignedIn && me && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8 sm:mb-12"
            >
              {/* Welcome Message */}
              <div className="text-center mb-6 sm:mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2"
                >
                  Willkommen zurück,{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    {me.name}
                  </span>
                  ! 🍻
                </motion.h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
                <StatCard
                  label="Biercoins"
                  value={me.balance}
                  icon="🪙"
                  gradient="from-yellow-600/80 to-orange-600/80"
                />
                <StatCard
                  label="Biere dieses Jahr"
                  value={me.currScore}
                  icon="🍺"
                  gradient="from-blue-600/80 to-purple-600/80"
                />
                <div className="sm:col-span-2 lg:col-span-1">
                  <StatCard
                    label="Status"
                    value="Online"
                    icon="🟢"
                    gradient="from-green-600/80 to-emerald-600/80"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Beer Image with Floating Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex justify-center mb-8 sm:mb-12"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-2xl scale-150"></div>
              <Image
                src="/assets/beer.png"
                alt="Hero Beer"
                width={200}
                height={200}
                className="relative z-10 drop-shadow-2xl w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain"
              />
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex justify-center"
          >
            <button
              onClick={scrollToSection}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 px-6 sm:px-8 py-3 sm:py-4 font-bold text-black text-sm sm:text-base md:text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25"
            >
              <span className="relative z-10 flex items-center text-white gap-2">
                🏆 Alkoholiker des Monats
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </motion.div>

          {/* Loading/Error States */}
          {isLoaded && isSignedIn && loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 text-white/70">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin"></div>
                Lade deine Daten...
              </div>
            </motion.div>
          )}

          {!isLoaded || (!isSignedIn && isLoaded) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-white/70 text-lg mb-4">
                🔐 Melde dich an für das ultimative Bier-Erlebnis
              </p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Hero;
