// app/api/stats/monthly-comparison/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  try {
    // Default to current month/year if not specified
    const now = new Date();
    const targetMonth = monthParam ? parseInt(monthParam) - 1 : now.getMonth(); // 0-based
    const targetYear = yearParam ? parseInt(yearParam) : now.getFullYear();

    // Get start and end of the target month
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0); // Last day of month

    // Get all users with their drinks for the target month
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        Drink: {
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: new Date(endOfMonth.getTime() + 24 * 60 * 60 * 1000 - 1), // End of last day
            },
          },
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Generate all days of the month
    const daysInMonth = endOfMonth.getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Process data for each user
    const userData = users.map((user) => {
      // Create a map of day -> drink count
      const dailyCounts: { [key: number]: number } = {};

      // Initialize all days with 0
      days.forEach((day) => {
        dailyCounts[day] = 0;
      });

      // Count drinks per day
      user.Drink.forEach((drink) => {
        const day = drink.createdAt.getDate();
        dailyCounts[day]++;
      });

      // Convert to array format for chart
      const dailyData = days.map((day) => ({
        day,
        count: dailyCounts[day],
        date: `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      }));

      const totalDrinks = user.Drink.length;
      const activeDays = Object.values(dailyCounts).filter(
        (count) => count > 0
      ).length;
      const avgPerDay =
        activeDays > 0 ? Math.round((totalDrinks / activeDays) * 10) / 10 : 0;
      const maxInOneDay = Math.max(...Object.values(dailyCounts));

      return {
        id: user.id,
        name: user.name,
        dailyData,
        stats: {
          totalDrinks,
          activeDays,
          avgPerDay,
          maxInOneDay,
          consistency: activeDays / daysInMonth, // Percentage of days active
        },
      };
    });

    // Sort by total drinks for ranking
    userData.sort((a, b) => b.stats.totalDrinks - a.stats.totalDrinks);

    // Add rankings
    const rankedUserData = userData.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({
      month: {
        name: new Date(targetYear, targetMonth).toLocaleString("de-DE", {
          month: "long",
        }),
        year: targetYear,
        monthNumber: targetMonth + 1,
        daysInMonth,
      },
      users: rankedUserData,
      summary: {
        totalUsers: userData.length,
        totalDrinks: userData.reduce(
          (sum, user) => sum + user.stats.totalDrinks,
          0
        ),
        mostActiveUser: userData[0] || null,
        averageDrinksPerUser:
          userData.length > 0
            ? Math.round(
                (userData.reduce(
                  (sum, user) => sum + user.stats.totalDrinks,
                  0
                ) /
                  userData.length) *
                  10
              ) / 10
            : 0,
      },
    });
  } catch (error) {
    console.error("Monthly comparison API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
