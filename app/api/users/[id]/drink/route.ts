// app/api/users/[id]/drink/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  // Balance bleibt unverändert, nur Zähler hochzählen:
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      currScore: { increment: 1 },
      balance: { decrement: 1 },
    },
  });

  return NextResponse.json(updated);
}
