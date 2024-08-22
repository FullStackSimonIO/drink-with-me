// actions/updateCount.ts
"use server"; // Markiere diese Datei als Server-kompatibel

import { prisma } from "../lib/prisma";

interface UpdateCountInput {
  userId: string;
  increment: boolean;
}

export async function updateCount({ userId, increment }: UpdateCountInput) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        currCount: {
          increment: increment ? 1 : -1,
        },
        monthlyCount: {
          increment: increment ? 1 : -1,
        },
        yearlyCount: {
          increment: increment ? 1 : -1,
        },
      },
    });
    return { user, success: true };
  } catch (error: any) {
    console.error("Error updating counts:", error);
    return { error: error.message, success: false };
  }
}
