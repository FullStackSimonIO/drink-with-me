// components/ProfileMonthlyChart.tsx
"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Calendar, TrendingUp, BarChart3, Activity } from "lucide-react";
import { useState } from "react";

type Monthly = { month: string; count: number };

// Hilfsfunktion: erzeugt ["Jan", "Feb", ..., "Dec"]
const getAllMonths = () => {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );
};

export function ProfileMonthlyChart({ userId }: { userId: string }) {
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const { data, error, isLoading } = useSWR<Monthly[]>(
    `/api/users/${userId}/monthly`,
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
    }
  );

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 border border-white/10 shadow-2xl p-6"
      >
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-white">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin"></div>
            <span className="text-sm">Lade Diagramm...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-red-800/90 via-red-900/90 to-slate-800/90 border border-red-500/20 shadow-2xl p-6"
      >
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-300 font-medium">Fehler beim Laden</p>
          <p className="text-red-400/70 text-sm mt-1">
            {error.message || "Diagramm konnte nicht geladen werden"}
          </p>
        </div>
      </motion.div>
    );
  }

  // Normiere: sicherstellen, dass für jeden Monat ein Eintrag da ist
  const months = getAllMonths();
  const mapByMonth = new Map<string, number>(
    (data || []).map((d) => [d.month, d.count])
  );

  // finaler Datensatz: immer 12 Einträge
  const chartData = months.map((m) => ({
    month: m,
    count: mapByMonth.get(m) ?? 0,
  }));

  // Bestimme Y-Max und Statistiken
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const totalCount = chartData.reduce((sum, d) => sum + d.count, 0);
  const avgCount = Math.round((totalCount / 12) * 10) / 10;
  const bestMonth = chartData.reduce((best, current) =>
    current.count > best.count ? current : best
  );

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-2xl">
          <p className="text-white font-medium">{label} 2025</p>
          <p className="text-orange-400 font-bold">
            {payload[0].value} Bier{payload[0].value !== 1 ? "e" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 border border-white/10 shadow-2xl"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/10 to-yellow-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              Jährlicher Bierkonsum
            </h3>
            <p className="text-white/60 text-sm">Jan – Dez 2025</p>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1 mt-3 sm:mt-0">
            <button
              onClick={() => setChartType("area")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                chartType === "area"
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              Area
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                chartType === "bar"
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              Balken
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
            <p className="text-white/60 text-xs mb-1">Gesamt</p>
            <p className="text-white font-bold text-lg">{totalCount}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
            <p className="text-white/60 text-xs mb-1">Ø pro Monat</p>
            <p className="text-white font-bold text-lg">{avgCount}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
            <p className="text-white/60 text-xs mb-1">Bester Monat</p>
            <p className="text-white font-bold text-lg">{bestMonth.month}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <ChartContainer
            config={{
              count: {
                label: "Biere",
                color: "#ff7000",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              {chartType === "area" ? (
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="beerGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#ff7000" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#ff7000"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff20"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff80", fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff80", fontSize: 11 }}
                    domain={[0, maxCount]}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#ff7000"
                    fill="url(#beerGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#ff7000", strokeWidth: 2, r: 4 }}
                    activeDot={{
                      r: 6,
                      fill: "#ffa500",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#ffa500" />
                      <stop offset="100%" stopColor="#ff7000" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff20"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff80", fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff80", fontSize: 11 }}
                    domain={[0, maxCount]}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Insights */}
        {totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"
          >
            <p className="text-blue-300 text-xs">
              💡 <strong>{bestMonth.month}</strong> war dein bester Monat mit{" "}
              <strong>{bestMonth.count} Bieren</strong>.
              {avgCount > 0 && (
                <>
                  {" "}
                  Du trinkst durchschnittlich{" "}
                  <strong>{avgCount} Biere pro Monat</strong>.
                </>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
