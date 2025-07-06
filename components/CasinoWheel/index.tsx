// components/CasinoWheel.tsx
"use client";

import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Button } from "@/components/ui/button";

const SEGMENTS = [
  { option: "🍺" },
  { option: "Niete" },
  { option: "Niete" },
  { option: "🍺🍺" },
  { option: "Niete" },
  { option: "Niete" },
  { option: "🍺🍺🍺" },
  { option: "Niete" },
  { option: "Niete" },
];

export default function CasinoWheel({
  tokens,
  onSpin,
}: {
  tokens: number;
  onSpin: (rawIndex: number) => Promise<void>;
}) {
  const [mustStart, setMustStart] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const SEG_COUNT = SEGMENTS.length;
  const HALF_SLICE = 360 / SEG_COUNT / 2; // 20°
  const OFFSET = Math.ceil(SEG_COUNT / 4); // 3

  const handleSpin = () => {
    if (mustStart || tokens <= 0) return;

    const rawIndex = Math.floor(Math.random() * SEG_COUNT);
    // das Wheel erwartet pointerIndex, nicht rawIndex
    const pointerIndex = (rawIndex + OFFSET) % SEG_COUNT;

    setPrizeNumber(pointerIndex);
    setMustStart(true);

    // Sobald das Drehen fertig ist, rufen wir onSpin(rawIndex) auf:
    // (das passiert in onStopSpinning weiter unten)
    // so stellen wir sicher, dass rawIndex die "echte" Prize-Zahl ist.
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Wrapper-Rotation um den Zeiger bei 12 Uhr zu zentrieren */}
      <div
        className="relative"
        style={{ transform: `rotate(-${HALF_SLICE}deg)` }}
      >
        <Wheel
          mustStartSpinning={mustStart}
          prizeNumber={prizeNumber}
          data={SEGMENTS}
          outerBorderColor="#ffa500"
          outerBorderWidth={8}
          innerBorderColor="#1f1f28"
          innerBorderWidth={4}
          radiusLineColor="#1f1f28"
          radiusLineWidth={2}
          textColors={["#ffffff", "#ffa500"]}
          backgroundColors={["#1f1f28", "#1f1f28"]}
          fontSize={18}
          onStopSpinning={async () => {
            setMustStart(false);
            // rawIndex = prizeNumber - OFFSET modulo SEG_COUNT
            // Um rawIndex zurückzugewinnen:
            const rawIndex = (prizeNumber - OFFSET + SEG_COUNT) % SEG_COUNT;
            await onSpin(rawIndex);
          }}
        />
        {/* eigener Pointer, zurückrotiert */}
        <div
          className="absolute top-0 left-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-red-500"
          style={{ transform: `translateX(-50%) rotate(${HALF_SLICE}deg)` }}
        />
      </div>

      <div className="text-lg text-white">
        Aktuelle Tokens:{" "}
        <span className={tokens > 0 ? "text-green-400" : "text-red-500"}>
          {tokens}
        </span>
      </div>

      <Button
        size="lg"
        onClick={handleSpin}
        disabled={mustStart || tokens <= 0}
        className="px-6 py-4 text-[#161821] bg-primary-500 rounded-lg font-bold hover:-translate-y-1 transition"
      >
        {mustStart
          ? "Dreht…"
          : tokens > 0
            ? "Token einlösen"
            : "Keine Tokens übrig"}
      </Button>
    </div>
  );
}
