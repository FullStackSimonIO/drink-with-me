// app/api/profile/route.ts
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }, // Replace 'id' with the correct unique field if different
    select: { name: true, profileImage: true, currScore: true },
  });
  return NextResponse.json(user);
}
