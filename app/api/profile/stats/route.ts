// app/api/profile/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const profileUserId = searchParams.get("userId");

  if (!profileUserId) {
    return new NextResponse("User ID required", { status: 400 });
  }

  try {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: profileUserId },
      include: {
        Drink: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Calculate statistics
    const totalDrinks = user.Drink.length;
    const now = new Date();
    const currentYear = now.getFullYear();

    // Drinks this year
    const drinksThisYear = user.Drink.filter(
      (drink) => drink.createdAt.getFullYear() === currentYear
    );

    // Calculate average per month (only for months with drinks)
    const monthsWithDrinks = new Set(
      drinksThisYear.map((drink) => drink.createdAt.getMonth())
    );
    const avgPerMonth =
      monthsWithDrinks.size > 0
        ? Math.round((drinksThisYear.length / monthsWithDrinks.size) * 10) / 10
        : 0;

    // Find best month
    const monthCounts: { [key: string]: number } = {};
    drinksThisYear.forEach((drink) => {
      const monthKey = `${drink.createdAt.getFullYear()}-${drink.createdAt.getMonth() + 1}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    const bestMonthEntry = Object.entries(monthCounts).reduce(
      (max, [month, count]) => (count > max.count ? { month, count } : max),
      { month: "N/A", count: 0 }
    );

    // Calculate active days (days with at least one drink)
    const activeDays = new Set(
      user.Drink.map((drink) => drink.createdAt.toDateString())
    ).size;

    // Calculate current streak (consecutive days with drinks)
    let streak = 0;
    const sortedDrinks = user.Drink.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const drinkDays = Array.from(
      new Set(sortedDrinks.map((drink) => drink.createdAt.toDateString()))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    for (let i = 0; i < drinkDays.length; i++) {
      const currentDay = new Date(drinkDays[i]);
      const expectedDay = new Date(now);
      expectedDay.setDate(expectedDay.getDate() - i);

      if (currentDay.toDateString() === expectedDay.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    // Get user rank (based on current score)
    const usersAbove = await prisma.user.count({
      where: {
        currScore: {
          gt: user.currScore,
        },
      },
    });
    const rank = usersAbove + 1;

    // Mock win rate (you can implement based on casino game results)
    const winRate = Math.floor(Math.random() * 40) + 30; // 30-70%

    // Generate achievements based on stats
    const achievements: string[] = [];

    if (totalDrinks >= 100)
      achievements.push("🍺 Bierfachmann - 100+ Biere getrunken");
    if (totalDrinks >= 500)
      achievements.push("🏆 Biermeister - 500+ Biere getrunken");
    if (totalDrinks >= 1000)
      achievements.push("👑 Bierlegende - 1000+ Biere getrunken");

    if (streak >= 7) achievements.push("🔥 Wochenstreaker - 7 Tage in Folge");
    if (streak >= 30) achievements.push("📅 Monatsmarathon - 30 Tage in Folge");

    if (rank <= 10) achievements.push("⭐ Top 10 - Unter den besten 10");
    if (rank === 1) achievements.push("🥇 Champion - Platz 1 erreicht");

    if (user.level >= 10)
      achievements.push("🎯 Level Master - Level 10 erreicht");
    if (user.balance >= 100)
      achievements.push("💰 Wohlhabend - 100€+ Guthaben");

    const stats = {
      totalDrinks,
      avgPerMonth,
      bestMonth: bestMonthEntry.month,
      daysActive: activeDays,
      streak,
      rank,
      winRate,
      achievements,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Profile stats error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
