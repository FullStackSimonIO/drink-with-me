// app/api/users/[id]/balance/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 1) Benutzer-ID aus der URL
  const userId = params.id;

  // 2) JSON-Body mit { delta: number }
  const { delta } = (await req.json()) as { delta?: number };
  if (typeof delta !== "number") {
    return new NextResponse("Bad Request: delta fehlt oder ist kein Number", {
      status: 400,
    });
  }

  try {
    // 3) Update in der DB: beerBalance um delta inkrementieren
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: delta } },
      select: { id: true, name: true, balance: true, currScore: true },
    });
    return NextResponse.json(updatedUser);
  } catch (err) {
    // 4) Fehler-Handling, z.B. wenn user nicht existiert
    return new NextResponse("User nicht gefunden", { status: 404 });
  }
}
