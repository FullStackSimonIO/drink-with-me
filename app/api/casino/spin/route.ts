// app/api/casino/spin/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1) Versuche, ein Token zu verbrauchen – nur, wenn tokens > 0
  const me = await prisma.user.updateMany({
    where: { clerkUserId: userId, tokens: { gt: 0 } },
    data: { tokens: { decrement: 1 }, purchaseProgress: { increment: 1 } },
  });

  if (me.count === 0) {
    // kein Datensatz aktualisiert → keine Tokens mehr
    return NextResponse.json({ error: "No tokens" }, { status: 400 });
  }

  // 2) ggf. bei je 10 Käufen neues Token vergeben
  const { purchaseProgress } = await prisma.user.findUniqueOrThrow({
    where: { clerkUserId: userId },
    select: { purchaseProgress: true },
  });
  if (purchaseProgress >= 10) {
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: { tokens: { increment: 1 }, purchaseProgress: { set: 0 } },
    });
  }

  // 3) Spin-Logik
  const SEGMENTS = ["1", "N", "N", "2", "N", "N", "3", "N", "N"];
  const prizeIndex = Math.floor(Math.random() * SEGMENTS.length);
  const label = SEGMENTS[prizeIndex];
  const prizeAmount = label === "N" ? 0 : Number(label);

  // 4) Gutschrift auf Balance, wenn gewonnen
  if (prizeAmount > 0) {
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: { balance: { increment: prizeAmount } },
    });
  }

  return NextResponse.json({ prizeIndex, prizeAmount });
}
