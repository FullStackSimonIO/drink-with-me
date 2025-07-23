// app/api/users/[id]/drink/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { handleTokenGenerationInTransaction } from "@/app/lib/tokenLogic";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      level: true,
      levelProgress: true,
    },
  });
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // 3) Berechne neues levelProgress und ob wir leveln
  const newProgress = user.levelProgress + 1;
  const willLevelUp = newProgress >= user.level;

  // 4) Transaktion: Freibier-Pool/Balance anpassen + Drink anlegen + Level-Logik
  const updatedUser = await prisma.$transaction(async (tx) => {
    // a) Freibier-Pool oder Balance
    if (fb.count > 0) {
      await tx.freeBeer.update({
        where: { id: "singleton" },
        data: { count: { decrement: 1 } },
      });
    } else {
      // Decrease balance by 1
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: 1 } },
      });

      // Handle token generation for balance decrease (-1 balance)
      await handleTokenGenerationInTransaction(tx, userId, -1);
    }

    // b) currScore & levelProgress (+ optional LevelUp)
    const userUpdateData: any = {
      currScore: { increment: 1 },
      levelProgress: willLevelUp ? { set: 0 } : { increment: 1 },
    };
    if (willLevelUp) {
      userUpdateData.level = { increment: 1 };
    }
    const u = await tx.user.update({
      where: { id: userId },
      data: userUpdateData,
      select: {
        currScore: true,
        balance: true,
        level: true,
        levelProgress: true,
      },
    });

    // c) Drink‐Log
    await tx.drink.create({
      data: { userId },
    });

    return u;
  });

  return NextResponse.json({ ok: true, user: updatedUser });
}
