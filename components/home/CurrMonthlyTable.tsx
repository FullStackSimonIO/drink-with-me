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
  { name: "Simon E.", desktop: 186 },
  { name: "Alex Z.", desktop: 305 },
  { name: "Christian Z.", desktop: 237 },
  { name: "Simon M.", desktop: 73 },
  { name: "Tobias L.", desktop: 209 },
  { name: "Michael Z.", desktop: 214 },
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
        <h2 className="text-3xl font-bold">Aktueller Stand</h2>
      </div>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Aktueller Stand</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
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
        <CardFooter className="flex flex-col items-start gap-2 text-sm">
          <p>Herzlichen Glückwunsch Christian!</p>
          <p>Du liegst mit 36 Halben vorne!</p>
        </CardFooter>
      </Card>
    </section>
  );
}
