// app/page.tsx
import Hero from "@/components/home/Hero";
import DrinkTable, { UserType } from "@/components/home/DrinkTable";
import { MonthlyComparisonChart } from "@/components/MonthlyComparisonChart";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../lib/prisma";
import { OnlineUsers } from "@/components/OnlineUsers";
import { BeerDataTable } from "@/components/home/DataTable";

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
      level: true, // Level hinzufügen
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
          level: true, // Level hinzufügen
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
      <DrinkTable users={users} me={me} />

      {/* Monthly Comparison Chart Section */}
      <section className="px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <MonthlyComparisonChart />
        </div>
      </section>
    </main>
  );
}
