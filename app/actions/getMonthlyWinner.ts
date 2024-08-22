// actions/getTopUser.ts
"use server"; // Markiere diese Datei als Server-kompatibel

import { prisma } from "../lib/prisma";

export async function getTopUserByMonthlyCount() {
  try {
    const topUser = await prisma.user.findFirst({
      orderBy: {
        monthlyCount: "desc", // Sortiere nach `monthlyCount` absteigend
      },
    });

    return { user: topUser, success: true };
  } catch (error: any) {
    console.error("Error fetching top user by monthly count:", error);
    return { error: error.message, success: false };
  }
}
