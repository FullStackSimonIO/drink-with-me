// app/actions/userActions.ts
"use server";

import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function addUser(name: string, profileImage: string) {
  const user = await prisma.user.create({
    data: {
      name,
      profileImage,
      monthlyCount: 0,
      yearlyCount: 0,
      currCount: 0,
    },
  });
  return user;
}

export async function getTopThreeUsersByMonthlyCount() {
  const currentDate = new Date();
  const previousMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const month = previousMonthDate.getMonth() + 1; // JavaScript months are 0-based
  const year = previousMonthDate.getFullYear();

  try {
    const users = await prisma.monthlyStat.findMany({
      where: {
        month,
        year,
      },
      orderBy: {
        count: "desc",
      },
      take: 3,
      include: {
        user: true,
      },
    });

    return {
      success: true,
      users: users.map((stat) => ({
        name: stat.user.name,
        profileImage: stat.user.profileImage,
        monthlyCount: stat.count,
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
// app/actions/userActions.ts

export async function fetchUsers() {
  const users = await prisma.user.findMany();
  return users;
}
