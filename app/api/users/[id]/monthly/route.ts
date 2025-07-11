// app/api/users/[id]/monthly/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  // 1) Zeitraum: vor 11 Monaten bis jetzt
  const since = new Date();
  since.setMonth(since.getMonth() - 11);

  // 2) Hol alle Drinks dieses Users seit dem Datum
  const drinks = await prisma.drink.findMany({
    where: {
      userId,
      createdAt: { gte: since },
    },
    select: { createdAt: true },
  });

  // 3) Initialisiere Zähler für jeden Monats-Shortname
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );
  const counts: Record<string, number> = {};
  months.forEach((m) => {
    counts[m] = 0;
  });

  // 4) Zähle jeden Drink auf den richtigen Monat
  for (const { createdAt } of drinks) {
    const m = new Date(createdAt).toLocaleString("default", {
      month: "short",
    });
    counts[m]++;
  }

  // 5) Baue das finale Array in Chart-friendly Form
  const data = months.map((month) => ({
    month,
    count: counts[month] || 0,
  }));

  return NextResponse.json(data);
}
