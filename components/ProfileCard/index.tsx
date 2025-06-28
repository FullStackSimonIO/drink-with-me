"use client";

import React from "react";
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/app/lib/hooks/useUserProfile";

export function ProfileCard() {
  const { profile, isLoaded, isSignedIn, loadingProfile } = useUserProfile();

  if (!isLoaded || loadingProfile) {
    return <p>Profil wird geladen…</p>;
  }

  if (!isSignedIn || !profile) {
    return <p>Bitte melde dich an, um dein Profil zu sehen.</p>;
  }
  //console.log("ProfileCard mounted, hook:", { isLoaded, isSignedIn, profile });

  return (
    <Card className="max-w-sm mx-auto bg-black">
      <CardHeader>
        <CardTitle>Mein Profil</CardTitle>
        <CardDescription>Übersicht deiner Informationen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.profileImage && (
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
            <Image
              src={profile.profileImage}
              alt="Profilbild"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
        )}
        <div>
          <p className="font-semibold text-white">Name:</p>
          <p className="text-white">{profile.name}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Aktueller Score:</p>
          <p className="text-white">{profile.currScore}</p>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Letzte Aktualisierung: gerade eben
        </p>
      </CardFooter>
    </Card>
  );
}
