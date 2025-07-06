import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

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

  // Transaktion: balance & token-Progress
  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.user.update({
      where: { id: params.id },
      data: { balance: { increment: delta } },
      select: { id: true, balance: true, tokens: true, purchaseProgress: true },
    });

    if (delta > 0) {
      let prog = u.purchaseProgress + delta;
      const tokensToAdd = Math.floor(prog / 10);
      prog = prog % 10;
      if (tokensToAdd > 0) {
        await tx.user.update({
          where: { id: params.id },
          data: {
            tokens: { increment: tokensToAdd },
            purchaseProgress: prog,
          },
        });
      } else {
        await tx.user.update({
          where: { id: params.id },
          data: { purchaseProgress: prog },
        });
      }
    }

    return u;
  });

  return NextResponse.json(updated);
}
