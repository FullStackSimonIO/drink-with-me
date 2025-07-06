// app/api/users/[id]/balance/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 1) Auth
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // 2) Lade den aufrufenden User (me)
  const me = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, role: true },
  });
  if (!me) return new NextResponse("User not found", { status: 404 });

  // 3) Body & delta prüfen
  const { delta } = (await req.json()) as { delta?: number };
  if (typeof delta !== "number") {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 4) Authorization:
  //    - USER darf nur für sich selbst delta = -1
  //    - ADMIN darf alles
  if (me.role === "USER") {
    if (delta !== -1 || params.id !== me.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // 5) Update
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
