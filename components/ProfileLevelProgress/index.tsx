// components/ProfileLevelProgress.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Medal } from "lucide-react";

type ProfileLevelProgressProps = {
  score: number; // insgesamt getrunkene Biere
  currentLevel: number; // aktuelles Level
  progress: number; // Biere im aktuellen Level-Intervall
};

export default function ProfileLevelProgress({
  score,
  currentLevel,
  progress,
}: ProfileLevelProgressProps) {
  // Für Level n braucht man n Bier, also für nächstes Level n+1 Bier:
  const nextLevelRequirement = currentLevel + 1;

  // Prozentueller Fortschritt im aktuellen Level:
  const percent = Math.min(
    Math.round((progress / nextLevelRequirement) * 100),
    100
  );

  return (
    <Card className="w-full max-w-md mx-auto p-4 bg-light-800 dark:bg-dark-400 rounded-2xl shadow-lg">
      <CardHeader className="flex items-center space-x-3">
        <Medal className="text-yellow-400 w-6 h-6" />
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Level {currentLevel}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Großer Kreis mit Prozent */}
        <div className="flex justify-center">
          <svg className="w-32 h-32" viewBox="0 0 100 100">
            {/* Hintergrundring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="10"
              className="text-light-700 dark:text-dark-300"
              stroke="currentColor"
              fill="none"
            />
            {/* Fortschrittsring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="10"
              className="text-primary-500"
              strokeDasharray={`${(percent / 100) * 283} 283`}
              strokeDashoffset="0"
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 50 50)"
            />
            {/* Prozentzahl */}
            <text
              x="50"
              y="54"
              textAnchor="middle"
              className="text-xl font-bold text-gray-900 dark:text-gray-100"
            >
              {percent}%
            </text>
          </svg>
        </div>

        {/* Linearer Fortschrittsbalken */}
        <Progress value={percent} className="h-4 rounded-full" />

        {/* Beschriftung */}
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>In diesem Level:</span>
          <span>
            {progress} / {nextLevelRequirement} 🍺
          </span>
        </div>

        {/* Optional: Gesamtanzahl Biere und nächste Hürde */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Gesamtgetrunkene Biere: {score} 📊
        </div>
      </CardContent>
    </Card>
  );
}
