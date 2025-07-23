import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { handleTokenGenerationInTransaction } from "@/app/lib/tokenLogic";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = auth();
  if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

  const { delta } = (await req.json()) as { delta: number };
  if (typeof delta !== "number") {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Admin oder Self?
  const me = await prisma.user.findUnique({
    where: { clerkUserId: clerkId },
    select: { id: true, role: true },
  });
  if (!me) return new NextResponse("User not found", { status: 404 });
  if (me.role === "USER" && (delta < 0 || params.id !== me.id)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Transaktion: balance & token generation for balance decreases
  const updated = await prisma.$transaction(async (tx) => {
    // Update balance first
    const u = await tx.user.update({
      where: { id: params.id },
      data: { balance: { increment: delta } },
      select: { id: true, balance: true, tokens: true, purchaseProgress: true },
    });

    // Handle token generation for balance decreases (every -10 balance = 1 token)
    await handleTokenGenerationInTransaction(tx, params.id, delta);

    // Return updated user data
    return await tx.user.findUnique({
      where: { id: params.id },
      select: { id: true, balance: true, tokens: true, purchaseProgress: true },
    });
  });

  return NextResponse.json(updated);
}
