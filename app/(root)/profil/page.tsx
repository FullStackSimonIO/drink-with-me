// app/profile/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileMonthlyChart } from "@/components/ProfileDiagram";
import React from "react";
import { BeerTipper } from "@/components/BeerTipper";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { userId } = auth();
  if (!userId) {
    return <p className="text-center py-20">Bitte melde Dich an.</p>;
  }

  const me = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      role: true,
      name: true,
      profileImage: true,
      balance: true,
      currScore: true,
    },
  });
  if (!me) {
    return (
      <p className="text-center py-20 text-red-500">Benutzer nicht gefunden.</p>
    );
  }

  return (
    <main className="min-h-screen py-8 bg-light-800 dark:bg-dark-300 flex justify-center items-center">
      {/* Wir reduzieren die max-Breite, damit es nicht zu viel Rand gibt */}
      <div className="w-full max-w-4xl grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Profil-Karte (1/2 Breite ab md aufwärts) */}
        <div>
          <ProfileCard user={me} />
        </div>

        {/* Chart (1/2 Breite ab md aufwärts) */}
        <React.Suspense fallback={<div>Loading chart…</div>}>
          <ProfileMonthlyChart userId={me.id} />
        </React.Suspense>
        <BeerTipper />
      </div>
    </main>
  );
}
