// app/api/me/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const me = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      role: true,
      name: true,
      profileImage: true,
      balance: true,
      currScore: true,
      tokens: true,
      level: true,
      levelProgress: true,
      purchaseProgress: true,
    },
  });
  if (!me) return new NextResponse("Not Found", { status: 404 });
  return NextResponse.json(me);
}
