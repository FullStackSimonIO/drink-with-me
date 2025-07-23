// components/CasinoWheel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, Star } from "lucide-react";

const SEGMENTS = [
  { option: "🍺", value: 1, textColor: "text-white" },
  { option: "💀", value: 0, textColor: "text-red-400" },
  { option: "💀", value: 0, textColor: "text-red-400" },
  { option: "🍺🍺", value: 2, textColor: "text-white" },
  { option: "💀", value: 0, textColor: "text-red-400" },
  { option: "💀", value: 0, textColor: "text-red-400" },
  { option: "🍺🍺🍺", value: 3, textColor: "text-white" },
  { option: "💀", value: 0, textColor: "text-red-400" },
  { option: "💀", value: 0, textColor: "text-red-400" },
];

export default function CasinoWheel({
  tokens,
  onSpin,
  isSpinning = false,
}: {
  tokens: number;
  onSpin: (rawIndex: number) => Promise<void>;
  isSpinning?: boolean;
}) {
  const [rotation, setRotation] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);

  const SEG_COUNT = SEGMENTS.length;
  const SEGMENT_ANGLE = 360 / SEG_COUNT;

  const handleSpin = async () => {
    if (isSpinning || tokens <= 0) return;

    setShowSparkles(false);

    // Generate random winning segment
    const rawIndex = Math.floor(Math.random() * SEG_COUNT);
    const targetRotation = rotation + 360 * 5 + rawIndex * SEGMENT_ANGLE;

    setRotation(targetRotation);
    setCurrentSegment(rawIndex);

    // Show sparkles if it's a win
    if (SEGMENTS[rawIndex].value > 0) {
      setTimeout(() => setShowSparkles(true), 2500);
    }

    // Call onSpin after animation
    setTimeout(() => {
      onSpin(rawIndex);
    }, 100);
  };

  const WheelSegment = ({
    segment,
    index,
  }: {
    segment: (typeof SEGMENTS)[0];
    index: number;
  }) => {
    const startAngle = index * SEGMENT_ANGLE;
    const endAngle = (index + 1) * SEGMENT_ANGLE;

    // Calculate path for segment
    const radius = 140;
    const innerRadius = 20;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = 150 + radius * Math.cos(startAngleRad);
    const y1 = 150 + radius * Math.sin(startAngleRad);
    const x2 = 150 + radius * Math.cos(endAngleRad);
    const y2 = 150 + radius * Math.sin(endAngleRad);

    const x3 = 150 + innerRadius * Math.cos(endAngleRad);
    const y3 = 150 + innerRadius * Math.sin(endAngleRad);
    const x4 = 150 + innerRadius * Math.cos(startAngleRad);
    const y4 = 150 + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0;

    const pathData = [
      `M 150 150`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      `Z`,
    ].join(" ");

    // Text position
    const textAngle = startAngle + SEGMENT_ANGLE / 2;
    const textRadius = radius * 0.7;
    const textX = 150 + textRadius * Math.cos((textAngle * Math.PI) / 180);
    const textY = 150 + textRadius * Math.sin((textAngle * Math.PI) / 180);

    return (
      <g key={index}>
                <defs>
          <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={segment.value > 0 ? (segment.value === 1 ? "#3b82f6" : segment.value === 2 ? "#10b981" : "#f59e0b") : "#374151"} />
            <stop offset="100%" stopColor={segment.value > 0 ? (segment.value === 1 ? "#2563eb" : segment.value === 2 ? "#059669" : "#d97706") : "#1f2937"} />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          fill={`url(#gradient-${index})`}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          className="transition-all duration-300"
        />
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`text-lg font-bold ${segment.textColor}`}
          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
        >
          {segment.option}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Wheel Container */}
      <div className="relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl scale-110 animate-pulse"></div>

        {/* Outer Ring */}
        <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-2xl border-4 border-yellow-400">
          {/* Inner Wheel */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden shadow-inner">
            <motion.div
              className="w-full h-full"
              animate={{ rotate: rotation }}
              transition={{
                duration: 3,
                ease: [0.23, 1, 0.32, 1],
                type: "tween",
              }}
            >
              <svg width="300" height="300" className="w-full h-full">
                {SEGMENTS.map((segment, index) => (
                  <WheelSegment key={index} segment={segment} index={index} />
                ))}
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Pointer */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500 drop-shadow-lg"></div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl border-2 border-white/20 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Sparkles Animation */}
        <AnimatePresence>
          {showSparkles && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${i * 45}deg) translateY(-120px)`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spin Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          onClick={handleSpin}
          disabled={isSpinning || tokens <= 0}
          className={`relative overflow-hidden px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300 ${
            tokens > 0 && !isSpinning
              ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black"
              : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 cursor-not-allowed"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isSpinning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                Dreht...
              </>
            ) : tokens > 0 ? (
              <>
                <Star className="w-5 h-5" />
                Glücksrad drehen!
              </>
            ) : (
              "Keine Tokens übrig"
            )}
          </span>

          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl"></div>
        </Button>
      </motion.div>

      {/* Token Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-3 border border-white/10 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-sm uppercase tracking-wider">
              Verfügbare Tokens
            </p>
            <p
              className={`text-2xl font-bold ${tokens > 0 ? "text-yellow-400" : "text-red-400"}`}
            >
              {tokens}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Win Probability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-white/50 text-sm">
          Gewinnchance:{" "}
          {Math.round(
            (SEGMENTS.filter((s) => s.value > 0).length / SEGMENTS.length) * 100
          )}
          %
        </p>
      </motion.div>
    </div>
  );
}
