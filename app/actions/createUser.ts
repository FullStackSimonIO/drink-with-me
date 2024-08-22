// app/actions/createUser.ts

"use server";

import { prisma } from "../lib/prisma";

interface CreateUserInput {
  name?: string;
}

export async function createUser(data: CreateUserInput) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        // currCount, monthlyCount und yearlyCount werden automatisch auf 0 gesetzt
      },
    });
    return { user, success: true };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { error: error.message, success: false };
  }
}
