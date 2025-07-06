// app/api/users/[id]/tip/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 1) Auth-Check
  const { userId: spenderClerkId } = auth();
  if (!spenderClerkId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2) Spender aus DB holen (nur die ID reicht jetzt)
  const spender = await prisma.user.findUnique({
    where: { clerkUserId: spenderClerkId },
    select: { id: true },
  });
  if (!spender) {
    return new NextResponse("Spender nicht gefunden", { status: 404 });
  }

  // 3) Ziel-User prüfen (darf sich nicht selbst tippen)
  const targetId = params.id;
  if (targetId === spender.id) {
    return new NextResponse("Cannot tip yourself", { status: 400 });
  }

  // 4) Payload auslesen
  const { amount } = (await req.json()) as { amount?: number };
  if (typeof amount !== "number" || amount < 1) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 5) Transaktion: Ziel erhöhen, Spender reduzieren (auch ins Minus erlaubt)
  try {
    const [updatedTarget, updatedSpender] = await prisma.$transaction([
      prisma.user.update({
        where: { id: targetId },
        data: { balance: { increment: amount } },
        select: { id: true, balance: true },
      }),
      prisma.user.update({
        where: { id: spender.id },
        data: { balance: { decrement: amount } },
        select: { id: true, balance: true },
      }),
    ]);

    return NextResponse.json({
      target: updatedTarget,
      you: updatedSpender,
    });
  } catch (err) {
    return new NextResponse("Fehler beim Spenden", { status: 500 });
  }
}
