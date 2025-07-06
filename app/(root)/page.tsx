// app/page.tsx
import Hero from "@/components/home/Hero";
import DrinkTable, { UserType } from "@/components/home/DrinkTable";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../lib/prisma";
import { OnlineUsers } from "@/components/OnlineUsers";

// Liste der Clerk-UserIDs, die Adminrechte haben sollen
const ADMIN_IDS = (process.env.ADMIN_IDS || "").split(",");

export const dynamic = "force-dynamic";

export default async function Page() {
  const { userId } = auth();

  if (userId) {
    // Clerk-User laden
    const cu = await clerkClient.users.getUser(userId);

    // Auf Admin prüfen
    const isAdmin = ADMIN_IDS.includes(userId);

    // Upsert: beim Erstellen ggf. Admin, im Update niemals Role anfassen
    await prisma.user.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        name: cu.firstName || cu.emailAddresses[0].emailAddress,
        profileImage: cu.imageUrl,
        role: isAdmin ? "ADMIN" : "USER",
      },
      update: {
        // nur Name & Bild updaten, Rolle bleibt wie sie ist
        name: cu.firstName || cu.emailAddresses[0].emailAddress,
        profileImage: cu.imageUrl,
      },
    });
  }

  // Jetzt nur echte Clerk-User laden
  const users = await prisma.user.findMany({
    where: { clerkUserId: { not: null } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      clerkUserId: true,
      role: true,
      name: true,
      profileImage: true,
      balance: true,
      currScore: true,
    },
  });

  // Me laden
  const me: UserType | null = userId
    ? await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: {
          id: true,
          clerkUserId: true,
          role: true,
          name: true,
          profileImage: true,
          balance: true,
          currScore: true,
        },
      })
    : null;

  return (
    <main className="pb-8">
      <Hero />
      <OnlineUsers />
      <DrinkTable users={users} me={me} />
    </main>
  );
}
