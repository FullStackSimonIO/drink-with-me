// components/OnlineAlert.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import Image from "next/image";
import { X } from "lucide-react";

type PresenceUser = {
  id: string;
  name: string;
  profileImage?: string;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function OnlineAlert() {
  const { data: online, error } = useSWR<PresenceUser[]>(
    "/api/presence",
    fetcher,
    { refreshInterval: 30000 }
  );
  const prevRef = useRef<PresenceUser[]>([]);
  const [alert, setAlert] = useState<{ visible: boolean; text: string }>({
    visible: false,
    text: "",
  });

  useEffect(() => {
    if (!online) return;
    const prev = prevRef.current;
    const curr = online;
    const prevIds = new Set(prev.map((u) => u.id));
    const currIds = new Set(curr.map((u) => u.id));
    const joined = curr.filter((u) => !prevIds.has(u.id));
    const left = prev.filter((u) => !currIds.has(u.id));
    let text = "";
    if (joined.length) {
      text =
        joined.map((u) => u.name).join(", ") +
        (joined.length === 1 ? " ist" : " sind") +
        " online.";
    } else if (left.length) {
      text =
        left.map((u) => u.name).join(", ") +
        (left.length === 1 ? " ist" : " sind") +
        " offline.";
    }
    if (text) {
      setAlert({ visible: true, text });
      const t = setTimeout(
        () => setAlert((a) => ({ ...a, visible: false })),
        5000
      );
      return () => clearTimeout(t);
    }
  }, [online]);

  useEffect(() => {
    if (online) prevRef.current = online;
  }, [online]);

  if (!alert.visible || error) return null;

  return (
    <Alert
      className={`
        fixed bottom-4 left-1/2 transform -translate-x-1/2
        w-[90%] max-w-lg z-50
        bg-white/20 dark:bg-black/20 backdrop-blur-md
        border border-white/30 dark:border-black/30
        rounded-2xl shadow-lg
        animate-slide-in-up
      `}
    >
      <div className="flex justify-between items-center">
        <AlertTitle className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          Online-Benachrichtigung
        </AlertTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAlert((a) => ({ ...a, visible: false }))}
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>
      <AlertDescription className="mt-2">
        <p className="text-sm text-gray-800 dark:text-gray-100">{alert.text}</p>
        <div
          className="
            mt-3 flex space-x-3 overflow-x-auto
            scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500/40
            scrollbar-track-transparent
          "
        >
          {online!.map((u) => (
            <div
              key={u.id}
              className="
                flex-shrink-0 flex items-center space-x-2
                bg-white/30 dark:bg-black/30 backdrop-blur-sm
                rounded-full px-3 py-1
                hover:bg-white/40 dark:hover:bg-black/40 transition
              "
            >
              {u.profileImage ? (
                <Image
                  src={u.profileImage}
                  alt={u.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-400 rounded-full" />
              )}
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {u.name}
              </span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}
