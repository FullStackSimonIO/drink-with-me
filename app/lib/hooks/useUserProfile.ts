// lib/hooks/useUserProfile.ts
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export type UserProfile = {
  name: string;
  profileImage?: string;
  currScore: number;
};

export function useUserProfile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    setLoadingProfile(true);
    fetch("/api/profile", {
      credentials: "include", // <-- hier die entscheidende Zeile
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data: UserProfile) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));
  }, [isLoaded, isSignedIn, user]);

  return { user, isLoaded, isSignedIn, profile, loadingProfile };
}
