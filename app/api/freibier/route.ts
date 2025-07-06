// app/api/freibier/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.error();

  // Rolle prüfen
  const me = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });
  if (me?.role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins" }, { status: 403 });
  }

  const { delta } = (await req.json()) as { delta: number };

  // upsert singleton
  const fb = await prisma.freeBeer.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton", // ← hier muss die id rein
      count: delta,
    },
    update: {
      count: { increment: delta },
    },
  });

  return NextResponse.json({ count: fb.count });
}
