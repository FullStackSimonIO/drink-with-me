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
    if (!isLoaded || !isSignedIn) return;
    setLoadingProfile(true);

    fetch("/api/profile", {
      credentials: "include",
    })
      .then(async (res) => {
        console.log("profile fetch status:", res.status);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(setProfile)
      .catch((err) => {
        console.error("profile fetch error:", err);
        setProfile(null);
      })
      .finally(() => setLoadingProfile(false));
  }, [isLoaded, isSignedIn]);

  return { user, isLoaded, isSignedIn, profile, loadingProfile };
}
