// app/api/users/[id]/balance/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 1) Me aus der DB
  const me = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, role: true },
  });
  if (!me) {
    return new NextResponse("User not found", { status: 404 });
  }

  // 2) Body auslesen
  const { delta } = (await req.json()) as { delta?: number };
  if (typeof delta !== "number") {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 3) Autorisierung: USER darf nur delta=-1 an sich selbst
  if (me.role === "USER") {
    if (delta !== -1 || params.id !== me.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // 4) Update durchführen
  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { balance: { increment: delta } },
      select: { id: true, balance: true, currScore: true },
    });
    return NextResponse.json(updated);
  } catch {
    return new NextResponse("User not found", { status: 404 });
  }
}
