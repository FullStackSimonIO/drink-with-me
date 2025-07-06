// app/api/users/[id]/monthly/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  // Hole Drink-Logs gruppiert nach Jahr+Monat der letzten 12 Monate
  const result = await prisma.drink.groupBy({
    by: ["userId", "createdAt"],
    where: {
      userId,
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
      },
    },
    _count: { id: true },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Mappe in Chart-friendly Format
  const data = result.map((r) => {
    const createdAt = new Date(r.createdAt as Date);
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1; // getMonth() is zero-based
    const monthNum = year * 100 + month; // e.g. 202406
    const date = new Date(year, month - 1, 1);
    console.log("Mapping month:", monthNum, "for user:", userId);
    return {
      month: date.toLocaleString("default", { month: "short" }), // "Jan", "Feb" …
      count: r._count.id,
    };
  });

  return NextResponse.json(data);
}
