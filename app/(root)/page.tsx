// app/page.tsx
import Hero from "@/components/home/Hero";
import DrinkTable, { UserType } from "@/components/home/DrinkTable";
import { auth } from "@clerk/nextjs/server"; // ← /server nutzen
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  // 1) auth() gibt { userId: string | null }
  const { userId } = auth();

  // 2) Lade alle Nutzer
  const usersData = await prisma.user.findMany({
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

  const users: UserType[] = usersData.map((user) => ({
    ...user,
    profileImage: user.profileImage === null ? undefined : user.profileImage,
  }));

  // 3) Lade „me“ nur, wenn userId da ist
  const meData = userId
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

  const me: UserType | null = meData
    ? {
        ...meData,
        profileImage:
          meData.profileImage === null ? undefined : meData.profileImage,
      }
    : null;

  return (
    <main className="pb-8">
      <Hero />
      {/* Jetzt passen die Typen */}
      <DrinkTable users={users} me={me} />
    </main>
  );
}
