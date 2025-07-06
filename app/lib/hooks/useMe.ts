// lib/hooks/useMe.ts
import { useState, useEffect } from "react";

export type Me = {
  id: string;
  role: "USER" | "ADMIN";
  name: string;
  profileImage: string | null;
  balance: number;
  currScore: number;
};

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setMe)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { me, loading, error };
}
