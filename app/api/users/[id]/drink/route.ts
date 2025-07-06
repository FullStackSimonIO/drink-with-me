// app/api/users/[id]/drink/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  // 1) Freibier‐Singleton sicherstellen
  const fb = await prisma.freeBeer.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", count: 0 },
    update: {}, // nur existieren lassen
  });

  // 2) User existiert?
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return new NextResponse("User not found", { status: 404 });

  // 3) Transaktion: Pool oder Balance anpassen, UND in jedem Fall einen Drink‐Eintrag erstellen
  if (fb.count > 0) {
    await prisma.$transaction([
      prisma.freeBeer.update({
        where: { id: "singleton" },
        data: { count: { decrement: 1 } },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { currScore: { increment: 1 } },
      }),
      prisma.drink.create({
        data: {
          userId,
          // createdAt wird automatisch auf now gesetzt
        },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          currScore: { increment: 1 },
          balance: { decrement: 1 },
        },
      }),
      prisma.drink.create({
        data: {
          userId,
        },
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
