// app/api/users/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      clerkUserId: true,
      balance: true,
      profileImage: true,
      currScore: true,
    },
  });
  return NextResponse.json(users);
}
