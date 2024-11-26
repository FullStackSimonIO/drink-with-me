// app/actions/getTopThreeUsers.ts
"use server";

import { prisma } from "@/app/lib/prisma";

export async function getTopThreeUsersByMonthlyCount() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        monthlyCount: "desc",
      },
      take: 3,
    });

    return {
      success: true,
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        profileImage: user.profileImage,
        monthlyCount: user.monthlyCount,
        yearlyCount: user.yearlyCount,
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
