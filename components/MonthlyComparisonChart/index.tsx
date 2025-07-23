// components/MonthlyComparisonChart/index.tsx
"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  BarChart3,
  Crown,
  Medal,
  Award,
  Target,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserStats {
  totalDrinks: number;
  activeDays: number;
  avgPerDay: number;
  maxInOneDay: number;
  consistency: number;
}

interface DailyData {
  day: number;
  count: number;
  date: string;
}

interface UserData {
  id: string;
  name: string;
  rank: number;
  dailyData: DailyData[];
  stats: UserStats;
}

interface MonthlyComparisonData {
  month: {
    name: string;
    year: number;
    monthNumber: number;
    daysInMonth: number;
  };
  users: UserData[];
  summary: {
    totalUsers: number;
    totalDrinks: number;
    mostActiveUser: UserData | null;
    averageDrinksPerUser: number;
  };
}

// Color palette for different users
const USER_COLORS = [
  "#ff7000", // Orange
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange-red
  "#6366f1", // Indigo
  "#14b8a6", // Teal
];

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export function MonthlyComparisonChart() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data, error, isLoading } = useSWR<MonthlyComparisonData>(
    `/api/stats/monthly-comparison?month=${month}&year=${year}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
    }
  );

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
    return <Trophy className="w-4 h-4 text-blue-400" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-blue-400 to-blue-600";
  };

  // Prepare chart data by combining all users' daily data
  const chartData = React.useMemo(() => {
    if (!data) return [];

    const daysInMonth = data.month.daysInMonth;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return days.map((day) => {
      const dayData: any = { day };
      data.users.forEach((user, index) => {
        const dayCount = user.dailyData.find((d) => d.day === day)?.count || 0;
        dayData[user.name] = dayCount;
        dayData[`${user.name}_color`] = USER_COLORS[index % USER_COLORS.length];
      });
      return dayData;
    });
  }, [data]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-2xl max-w-xs">
          <p className="text-white font-medium mb-2">Tag {label}</p>
          <div className="space-y-1">
            {payload
              .filter((entry: any) => entry.value > 0)
              .sort((a: any, b: any) => b.value - a.value)
              .map((entry: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-white/90 text-sm">
                      {entry.dataKey}
                    </span>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {entry.value} 🍺
                  </span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

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
            <span className="text-sm">Lade Vergleichsdaten...</span>
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
            {error.message || "Vergleichsdaten konnten nicht geladen werden"}
          </p>
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 border border-white/10 shadow-2xl"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-400/10 to-red-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Monatsvergleich</h3>
              <p className="text-white/60 text-sm">
                Täglicher Bierkonsum aller Nutzer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Month Navigation */}
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 py-1 text-white font-medium min-w-[120px] text-center">
                {data.month.name} {data.month.year}
              </div>
              <button
                onClick={() => navigateMonth("next")}
                disabled={currentDate >= new Date()}
                className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setChartType("line")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  chartType === "line"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">Linie</span>
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
                <span className="hidden sm:inline">Balken</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
            <p className="text-white/60 text-xs mb-1">Gesamt Biere</p>
            <p className="text-white font-bold text-lg">
              {data.summary.totalDrinks}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
            <p className="text-white/60 text-xs mb-1">Aktive Nutzer</p>
            <p className="text-white font-bold text-lg">
              {data.summary.totalUsers}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
            <p className="text-white/60 text-xs mb-1">Ø pro Nutzer</p>
            <p className="text-white font-bold text-lg">
              {data.summary.averageDrinksPerUser}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
            <p className="text-white/60 text-xs mb-1">Champion</p>
            <p className="text-yellow-400 font-bold text-sm">
              {data.summary.mostActiveUser?.name || "N/A"}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
          <ChartContainer
            config={{
              ...data.users.reduce((acc, user, index) => {
                acc[user.name] = {
                  label: user.name,
                  color: USER_COLORS[index % USER_COLORS.length],
                };
                return acc;
              }, {} as any),
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "line" ? (
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff80", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff80", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {data.users.map((user, index) => (
                    <Line
                      key={user.id}
                      type="monotone"
                      dataKey={user.name}
                      stroke={USER_COLORS[index % USER_COLORS.length]}
                      strokeWidth={2}
                      dot={{
                        fill: USER_COLORS[index % USER_COLORS.length],
                        strokeWidth: 2,
                        r: 3,
                      }}
                      activeDot={{ r: 5, stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff80", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff80", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {data.users.map((user, index) => (
                    <Bar
                      key={user.id}
                      dataKey={user.name}
                      fill={USER_COLORS[index % USER_COLORS.length]}
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* User Rankings */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Rangliste
          </h4>

          <div className="grid gap-3">
            {data.users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full bg-gradient-to-r ${getRankColor(user.rank)}`}
                    >
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <h5 className="text-white font-bold">{user.name}</h5>
                      <p className="text-white/60 text-sm">Rang #{user.rank}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      {user.stats.totalDrinks} 🍺
                    </p>
                    <p className="text-white/60 text-xs">
                      {user.stats.activeDays} aktive Tage
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-white/60 text-xs">Ø pro Tag</p>
                    <p className="text-white font-bold text-sm">
                      {user.stats.avgPerDay}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-xs">Max an 1 Tag</p>
                    <p className="text-white font-bold text-sm">
                      {user.stats.maxInOneDay}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-xs">Konstanz</p>
                    <p className="text-white font-bold text-sm">
                      {Math.round(user.stats.consistency * 100)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
