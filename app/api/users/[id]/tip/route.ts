// app/api/users/[id]/tip/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 1) Authentifizieren
  const { userId: spenderClerkId } = auth();
  if (!spenderClerkId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2) Spender in DB laden
  const spender = await prisma.user.findUnique({
    where: { clerkUserId: spenderClerkId },
    select: { id: true },
  });
  if (!spender) {
    return new NextResponse("Spender not found", { status: 404 });
  }

  // 3) Ziel-User prüfen
  const targetId = params.id;
  if (targetId === spender.id) {
    // Optional: Selbst-Spenden verbieten
    return new NextResponse("Cannot tip yourself", { status: 400 });
  }

  // 4) Body auslesen
  const { amount } = (await req.json()) as { amount?: number };
  if (typeof amount !== "number" || amount < 1) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 5) Guthaben des Ziel-Users erhöhen
  try {
    const updated = await prisma.user.update({
      where: { id: targetId },
      data: { balance: { increment: amount } },
      select: { id: true, balance: true },
    });
    return NextResponse.json(updated);
  } catch {
    return new NextResponse("Target user not found", { status: 404 });
  }
}
