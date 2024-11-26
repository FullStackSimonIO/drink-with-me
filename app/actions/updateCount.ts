"use server";

import { prisma } from "@/app/lib/prisma";

export async function incrementUserScore(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { currScore: { increment: 1 } }, // currScore um 1 erhöhen
    });

    return updatedUser;
  } catch (error: any) {
    console.error("Error incrementing user score:", error);
    throw new Error("Unable to increment user score.");
  }
}

export async function decrementUserScore(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { currScore: { decrement: 1 } }, // currScore um 1 verringern
    });

    return updatedUser;
  } catch (error: any) {
    console.error("Error decrementing user score:", error);
    throw new Error("Unable to decrement user score.");
  }
}
