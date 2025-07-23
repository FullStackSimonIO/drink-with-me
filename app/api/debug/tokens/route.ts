// app/api/debug/tokens/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        name: true,
        balance: true,
        tokens: true,
        purchaseProgress: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      user: user,
      tokenLogic: {
        explanation: "Every 10 balance decrease = 1 token",
        currentProgress: user.purchaseProgress,
        progressToNextToken: 10 - user.purchaseProgress,
        totalTokensEarned: user.tokens,
      },
    });
  } catch (error) {
    console.error("Debug tokens error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
