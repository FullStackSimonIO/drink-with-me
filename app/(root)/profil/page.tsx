// app/profile/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { ProfileCard } from "@/components/ProfileCard";
import dynamic from "next/dynamic";
import React from "react";
import { BeerTipper } from "@/components/BeerTipper";

// dynamisch laden, nur client‐seitig, unterstützt Suspense
const ProfileMonthlyChart = dynamic(
  () =>
    import("@/components/ProfileDiagram").then(
      (mod) => mod.ProfileMonthlyChart
    ),
  { ssr: false, suspense: true }
);

const ProfileLevelProgress = dynamic(
  () => import("@/components/ProfileLevelProgress").then((mod) => mod.default),
  { ssr: false, suspense: true }
);

const fetchMode = "force-dynamic";

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
      level: true,
      levelProgress: true,
    },
  });
  if (!me) {
    return (
      <p className="text-center py-20 text-red-500">Benutzer nicht gefunden.</p>
    );
  }

  return (
    <main className="min-h-screen py-24 flex justify-center items-center background-light800_dark300">
      <div className="w-full max-w-4xl grid gap-6 grid-cols-1 md:grid-cols-2">
        <ProfileCard user={me} />

        <React.Suspense fallback={<div>Loading…</div>}>
          <ProfileMonthlyChart userId={me.id} />
          <ProfileLevelProgress
            score={me.currScore}
            currentLevel={me.level}
            progress={me.levelProgress}
          />
        </React.Suspense>

        <BeerTipper />
      </div>
    </main>
  );
}
