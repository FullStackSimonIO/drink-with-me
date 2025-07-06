// components/ProfileMonthlyChart.tsx
"use client";

import useSWR from "swr";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

type Monthly = { month: string; count: number };

// Hilfsfunktion: erzeugt ["Jan", "Feb", ..., "Dec"]
const getAllMonths = () => {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );
};

export function ProfileMonthlyChart({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR<Monthly[]>(
    `/api/users/${userId}/monthly`,
    (url: string) => fetch(url).then((r) => r.json())
  );

  if (isLoading) return <p className="py-8 text-center">Lade Diagramm…</p>;
  if (error)
    return (
      <p className="py-8 text-center text-red-500">
        Fehler beim Laden des Diagramms.
      </p>
    );

  // Normiere: sicherstellen, dass für jeden Monat ein Eintrag da ist
  const months = getAllMonths();
  // map input data nach monats-Shortname → count
  const mapByMonth = new Map<string, number>(
    (data || []).map((d) => [d.month, d.count])
  );
  // finaler Datensatz: immer 12 Einträge
  const chartData = months.map((m) => ({
    month: m,
    count: mapByMonth.get(m) ?? 0,
  }));

  // Bestimme Y-Max (ganzzahlig, aufrunden)
  const maxCount = Math.max(...chartData.map((d) => d.count));
  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-primary-500">
          Jährlicher Bierkonsum:
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Jan – Dez 2025
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <ChartContainer
          config={{ count: { label: "Bier", color: "var(--chart-2)" } }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 16, left: 16, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                interval={0}
                height={24}
              />
              <YAxis
                domain={[0, maxCount]}
                ticks={yTicks}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                width={30}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-2)"
                fill="#ff7000"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
