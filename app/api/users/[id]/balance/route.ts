// app/api/users/[id]/balance/route.ts
import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

// Querparameter ist jetzt direkt dein Prisma-User.id (cuid)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // Wenn du nicht clerkUserId abgleichen willst, sondern direkt mit params.id,
  // prüfst du einfach, ob params.id === me.id
  const me = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, role: true },
  });
  if (!me) return new NextResponse("Not Found", { status: 404 });

  const { delta } = await req.json();
  // Nur erlauben, wenn eigener Datensatz UND delta = -1, oder Admin
  if (me.role === "USER" && delta !== -1) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { balance: { increment: delta } },
  });

  return NextResponse.json(updated);
}
