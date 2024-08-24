// actions/getTopThreeUsers.ts
"use server";

import { prisma } from "../lib/prisma";

export async function getTopThreeUsersByMonthlyCount() {
  try {
    const topThreeUsers = await prisma.user.findMany({
      orderBy: {
        monthlyCount: "desc",
      },
      take: 3, // Limitiert auf die Top 3
    });

    return { users: topThreeUsers, success: true };
  } catch (error: any) {
    console.error("Error fetching top three users by monthly count:", error);
    return { error: error.message, success: false };
  }
}
