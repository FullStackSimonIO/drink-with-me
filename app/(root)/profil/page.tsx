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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 pt-24 md:pt-28 lg:pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Mein Profil
              </span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Verwalte dein Profil und verfolge deine Statistiken
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {/* Profile Card - Takes more space */}
            <div className="lg:col-span-1">
              <ProfileCard user={me} />
            </div>

            {/* Other Components */}
            <div className="space-y-6">
              <React.Suspense
                fallback={
                  <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin"></div>
                    </div>
                  </div>
                }
              >
                <ProfileMonthlyChart userId={me.id} />
              </React.Suspense>
            </div>

            {/* Beer Tipper */}
            <div className="lg:col-span-2 xl:col-span-1">
              <BeerTipper />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
