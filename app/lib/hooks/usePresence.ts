// lib/hooks/usePresence.ts
import useSWR from "swr";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePresence() {
  // 1) online-Nutzer holen, alle 30 Sekunden
  const {
    data: online,
    error,
    mutate,
  } = useSWR<{ id: string; name: string; profileImage?: string }[]>(
    "/api/presence",
    fetcher,
    {
      refreshInterval: 30000,
    }
  );

  // 2) Heartbeat: PATCH /api/presence alle 60 Sekunden
  useEffect(() => {
    let handle: number;
    const ping = async () => {
      await fetch("/api/presence", { method: "PATCH" });
    };
    ping();
    handle = window.setInterval(ping, 60000);
    return () => clearInterval(handle);
  }, []);

  return { online, isLoading: !online && !error, error };
}
