// app/api/profile/sync/route.ts
import { NextResponse } from "next/server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "node";

export async function POST(req: Request) {
  // 1) Auth-Check
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2) Clerk-Profil holen
  const u = await clerkClient.users.getUser(userId);
  const primaryEmail =
    u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
      ?.emailAddress ??
    u.emailAddresses[0]?.emailAddress ??
    "Unknown";
  const name = u.firstName?.trim() ? u.firstName : primaryEmail;
  const profileImage = u.imageUrl;

  // 3) Prisma-Upsert
  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, name, profileImage },
    update: { name, profileImage },
  });

  return NextResponse.json({ ok: true });
}
