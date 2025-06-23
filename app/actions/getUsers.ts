"use server";

import { prisma } from "@/app/lib/prisma";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      currScore: user.currScore,

      avatarUrl: user.profileImage, // Angenommen, das Feld heißt 'profileImage'
    }));
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error("Unable to fetch users.");
  }
}
