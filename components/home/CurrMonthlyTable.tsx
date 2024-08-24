"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { name: "Simon E.", desktop: 10 },
  { name: "Alex Z.", desktop: 13 },
  { name: "Christian Z.", desktop: 43 },
  { name: "Simon M.", desktop: 24 },
  { name: "Tobias L.", desktop: 2 },
  { name: "Michael Z.", desktop: 0 },
];

const chartConfig = {
  desktop: {
    label: "Bier getrunken: ",
    color: "#ffffff",
  },
} satisfies ChartConfig;

export function Chart() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-screen background-light800_dark300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary-500">Aktueller Stand</h2>
      </div>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          {/* Dynamically render Month + Year here */}
          <CardTitle className="text-primary-100 text-2xl">
            August 2024
          </CardTitle>
          <CardDescription className="text-primary-100 font-semibold">
            Das Chart gilt immer für den aktuellen Monat und setzt sich am
            Monatsanfang automatisch zurück
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart
              width={600}
              height={300}
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 15)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent hideLabel className="text-white" />
                }
              />
              <Bar dataKey="desktop" fill="#FF7000" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="text-white"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-center items-center flex-col  gap-2 text-sm">
          <p className="text-primary-100 text-lg font-semibold">
            Herzlichen Glückwunsch Christian!
          </p>
          <p className="text-primary-100 text-lg font-semibold">
            Du liegst mit 36 Halben vorne!
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
