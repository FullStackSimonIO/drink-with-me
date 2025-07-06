// app/api/presence/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

const ONLINE_THRESHOLD_MINUTES = 2; // z.B. wer in den letzten 2 Min aktiv war

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  // 1) nur signierte User dürfen pingen
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // 2) Update lastActive auf jetzt
  await prisma.user.update({
    where: { clerkUserId: userId },
    data: { lastActive: new Date() },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Liste aller User, deren lastActive in den letzten X Minuten liegt
  const since = new Date(Date.now() - ONLINE_THRESHOLD_MINUTES * 60 * 1000);
  const online = await prisma.user.findMany({
    where: { lastActive: { gte: since } },
    select: { id: true, name: true, profileImage: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(online);
}
